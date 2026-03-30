"""
Rule-based enrichment for remaining products.
Inherits semantic fields from already-enriched siblings (same brand or product_family).
No LLM calls needed.
"""
import asyncio, os, json
from datetime import datetime, timezone
from collections import defaultdict
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]
products_col = db["catalog_products"]
verification_log_col = db["web_verification_log"]

# Fields to inherit from siblings
INHERIT_FIELDS = [
    "proposed_semantic_brand_system", "proposed_semantic_parent_brand",
    "proposed_semantic_system_type", "proposed_semantic_implant_class",
    "proposed_semantic_material_default", "proposed_semantic_coating_default",
    "proposed_semantic_use_case_tags",
]

# Division-based default classifications (fallback when no sibling exists)
DIVISION_DEFAULTS = {
    "Infection Prevention": {
        "entity_type": "consumable",
        "system_type": "infection_prevention_consumable",
        "implant_class": "non_implantable_consumable",
        "use_case_tags": ["infection_prevention", "surgical_consumable"],
    },
    "Diagnostics": {
        "entity_type": "diagnostic_kit",
        "system_type": "diagnostic_system",
        "implant_class": "non_implantable_diagnostic",
        "use_case_tags": ["diagnostics", "laboratory"],
    },
    "Trauma": {
        "entity_type": "implant_class",
        "system_type": "trauma_fixation",
        "implant_class": "trauma_implant",
        "use_case_tags": ["trauma", "orthopedic"],
    },
    "Joint Replacement": {
        "entity_type": "implant_class",
        "system_type": "joint_replacement",
        "implant_class": "arthroplasty_implant",
        "use_case_tags": ["joint_replacement", "orthopedic"],
    },
    "ENT": {
        "entity_type": "product_family",
        "system_type": "ent_device",
        "implant_class": "ent_device",
        "use_case_tags": ["ent"],
    },
    "Endo Surgery": {
        "entity_type": "product_family",
        "system_type": "endoscopic_surgical",
        "implant_class": "surgical_consumable",
        "use_case_tags": ["endo_surgery", "surgical"],
    },
    "Spine": {
        "entity_type": "implant_class",
        "system_type": "spine_fixation",
        "implant_class": "spine_implant",
        "use_case_tags": ["spine", "orthopedic"],
    },
    "Critical Care": {
        "entity_type": "product_family",
        "system_type": "critical_care_device",
        "implant_class": "non_implantable_device",
        "use_case_tags": ["critical_care"],
    },
    "Cardiovascular": {
        "entity_type": "implant_class",
        "system_type": "cardiovascular_device",
        "implant_class": "cardiovascular_implant",
        "use_case_tags": ["cardiovascular"],
    },
    "Urology": {
        "entity_type": "product_family",
        "system_type": "urology_device",
        "implant_class": "urology_device",
        "use_case_tags": ["urology"],
    },
}

# Brand extraction from product name/family
KNOWN_BRANDS = {
    "maira": "MAIRA", "mirex": "MIREX", "midor": "MIDOR", "baktio": "BAKTIO",
    "inviro": "INVIRO", "pinion": "PINION", "mevel": "MEVEL", "mesire": "MESIRE",
    "alrine": "ALRINE", "myrac": "MYRAC", "armar": "ARMAR", "auric": "AURIC",
    "clavo": "CLAVO", "freedom": "FREEDOM", "destiknee": "DESTIKNEE",
    "filaprop": "FILAPROP", "merilisa": "MERILISA", "meriscreen": "MERISCREEN",
    "autoquant": "AUTOQUANT", "celquant": "CELQUANT", "clotquant": "CLOTQUANT",
    "floquant": "FLOQUANT", "glucquant": "GLUCQUANT", "spm": "SPM",
    "latitud": "LATITUD", "biomime": "BIOMIME", "myval": "MYVAL",
    "agfn": "AGFN", "filapron": "FILAPRON",
}


def extract_brand(product: dict) -> str:
    """Try to extract brand from product fields."""
    brand = product.get("brand", "")
    if brand:
        return brand
    
    # Try from product family or name
    family = (product.get("product_family") or "").lower()
    name = (product.get("product_name_display") or "").lower()
    slug = (product.get("slug") or "").lower()
    
    for key, canonical in KNOWN_BRANDS.items():
        if key in family or key in name or key in slug:
            return canonical
    
    return ""


async def find_sibling(product: dict) -> dict | None:
    """Find an already-enriched sibling product."""
    brand = product.get("brand", "")
    family = product.get("product_family", "")
    division = product.get("division_canonical", "")
    
    # Strategy 1: Same brand + division with proposed fields
    if brand:
        sibling = await products_col.find_one(
            {"brand": brand, "division_canonical": division,
             "proposed_web_verification_status": {"$exists": True}},
            {"_id": 0}
        )
        if sibling:
            return sibling
    
    # Strategy 2: Same product family prefix
    if family:
        # Try exact family match
        sibling = await products_col.find_one(
            {"product_family": family,
             "proposed_web_verification_status": {"$exists": True}},
            {"_id": 0}
        )
        if sibling:
            return sibling
        
        # Try family prefix (e.g., "MAIRA Surgical Gowns AAMI-2" -> "MAIRA")
        family_parts = family.split()
        if len(family_parts) > 1:
            prefix = family_parts[0]
            sibling = await products_col.find_one(
                {"product_family": {"$regex": f"^{prefix}", "$options": "i"},
                 "division_canonical": division,
                 "proposed_web_verification_status": {"$exists": True}},
                {"_id": 0}
            )
            if sibling:
                return sibling
    
    # Strategy 3: Already-enriched canonical sibling
    extracted_brand = extract_brand(product)
    if extracted_brand:
        sibling = await products_col.find_one(
            {"semantic_brand_system": extracted_brand,
             "semantic_brand_system": {"$nin": [None, ""]}},
            {"_id": 0}
        )
        if sibling:
            return sibling
    
    return None


async def main():
    remaining = await products_col.find(
        {"semantic_brand_system": {"$in": [None, ""]},
         "proposed_web_verification_status": {"$exists": False}},
        {"_id": 0}
    ).to_list(500)
    
    print(f"Processing {len(remaining)} remaining products (rule-based)...")
    
    inherited = 0
    defaulted = 0
    failed = 0
    
    for i, product in enumerate(remaining, 1):
        slug = product.get("slug", "")
        name = product.get("product_name_display", "")
        division = product.get("division_canonical", "")
        
        # Try to find sibling
        sibling = await find_sibling(product)
        
        if sibling:
            # Inherit from sibling
            staged = {}
            for field in INHERIT_FIELDS:
                if field in sibling and sibling[field]:
                    staged[field] = sibling[field]
            
            # Set own fields
            brand = extract_brand(product) or sibling.get("proposed_semantic_brand_system", "")
            staged["proposed_entity_type"] = sibling.get("proposed_entity_type", "product_family")
            staged["proposed_semantic_brand_system"] = brand
            staged["proposed_clinical_display_title"] = name
            staged["proposed_clinical_subtitle"] = f"{brand} by Meril" if brand else f"Meril {division}"
            staged["proposed_semantic_anatomy_scope"] = sibling.get("proposed_semantic_anatomy_scope", [])
            staged["proposed_semantic_procedure_scope"] = sibling.get("proposed_semantic_procedure_scope", [])
            staged["proposed_semantic_family_group"] = sibling.get("proposed_semantic_family_group", "")
            staged["proposed_semantic_confidence"] = min(
                sibling.get("proposed_semantic_confidence", 0.75) - 0.05, 0.85
            )
            staged["proposed_semantic_review_required"] = True
            staged["proposed_web_verification_status"] = "review_required_ambiguity"
            staged["proposed_recommended_action"] = "send_to_review"
            staged["proposed_conflict_detected"] = False
            staged["proposed_reasoning_summary"] = (
                f"Inherited from sibling [{sibling.get('slug', '')}] via brand/family match. "
                f"No LLM verification — rule-based inheritance only."
            )
            staged["proposed_enriched_at"] = datetime.now(timezone.utc).isoformat()
            
            await products_col.update_one({"slug": slug}, {"$set": staged})
            
            # Verification log
            await verification_log_col.insert_one({
                "product_id": slug, "slug": slug,
                "web_verification_triggered": False,
                "web_verification_reason": "rule_based_inheritance",
                "web_verification_status": "review_required_ambiguity",
                "web_verification_confidence_delta": 0,
                "source_priority_used": "internal_sibling",
                "external_sources": [],
                "external_conflict": False,
                "review_required": True,
                "final_recommended_action": "send_to_review",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            
            inherited += 1
            print(f"  [{i}/{len(remaining)}] {slug} — inherited from {sibling.get('slug', '')}")
        
        else:
            # Use division defaults
            defaults = DIVISION_DEFAULTS.get(division, {})
            brand = extract_brand(product)
            
            staged = {
                "proposed_entity_type": defaults.get("entity_type", "product_family"),
                "proposed_clinical_display_title": name,
                "proposed_clinical_subtitle": f"{brand} by Meril" if brand else f"Meril {division}",
                "proposed_semantic_brand_system": brand,
                "proposed_semantic_parent_brand": "Meril",
                "proposed_semantic_system_type": defaults.get("system_type", "unknown"),
                "proposed_semantic_implant_class": defaults.get("implant_class", "unknown"),
                "proposed_semantic_material_default": product.get("material_canonical"),
                "proposed_semantic_coating_default": None,
                "proposed_semantic_anatomy_scope": [],
                "proposed_semantic_procedure_scope": [],
                "proposed_semantic_family_group": product.get("product_family", ""),
                "proposed_semantic_use_case_tags": defaults.get("use_case_tags", []),
                "proposed_semantic_confidence": 0.60,
                "proposed_semantic_review_required": True,
                "proposed_web_verification_status": "insufficient_evidence",
                "proposed_recommended_action": "send_to_review",
                "proposed_conflict_detected": False,
                "proposed_reasoning_summary": (
                    f"No enriched sibling found. Used division-level defaults for {division}. "
                    f"Manual review required."
                ),
                "proposed_enriched_at": datetime.now(timezone.utc).isoformat(),
            }
            
            await products_col.update_one({"slug": slug}, {"$set": staged})
            
            await verification_log_col.insert_one({
                "product_id": slug, "slug": slug,
                "web_verification_triggered": False,
                "web_verification_reason": "no_sibling_available",
                "web_verification_status": "insufficient_evidence",
                "web_verification_confidence_delta": 0,
                "source_priority_used": "division_default",
                "external_sources": [],
                "external_conflict": False,
                "review_required": True,
                "final_recommended_action": "send_to_review",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            
            defaulted += 1
            print(f"  [{i}/{len(remaining)}] {slug} — division default ({division})")
    
    print(f"\n=== RULE-BASED ENRICHMENT COMPLETE ===")
    print(f"Inherited from siblings: {inherited}")
    print(f"Division defaults: {defaulted}")
    print(f"Total processed: {inherited + defaulted}")
    
    # Final counts
    total = await products_col.count_documents({})
    staged = await products_col.count_documents({"proposed_web_verification_status": {"$exists": True}})
    canonical = await products_col.count_documents({"semantic_brand_system": {"$nin": [None, ""]}})
    still_remaining = await products_col.count_documents({
        "semantic_brand_system": {"$in": [None, ""]},
        "proposed_web_verification_status": {"$exists": False}
    })
    print(f"\nFinal state:")
    print(f"  Total: {total}")
    print(f"  Canonical enriched: {canonical}")
    print(f"  Staged (proposed): {staged}")
    print(f"  Still remaining: {still_remaining}")
    print(f"  Coverage: {(canonical + staged) / total * 100:.1f}%")

asyncio.run(main())
