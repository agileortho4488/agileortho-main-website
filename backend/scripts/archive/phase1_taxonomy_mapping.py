"""
Phase 1: Taxonomy Mapping & Normalization
Creates canonical mapping layer for live + shadow catalog merge.

Outputs 6 MongoDB collections:
  - catalog_division_map
  - catalog_category_map
  - catalog_material_dict
  - catalog_brand_dict
  - catalog_product_family_map
  - catalog_taxonomy (master summary)

Rules:
  - Preserves ALL original values (live + shadow)
  - Never overwrites live naming directly
  - Shadow is enrichment, not automatic truth
  - Materials use controlled dictionary
  - Product family grouping includes confidence score
"""
import asyncio
import os
import re
from datetime import datetime, timezone
from collections import Counter, defaultdict
from dotenv import load_dotenv

load_dotenv()
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

# ─────────────────────────────────────────────────────────
# 1. DIVISION MAPPING
# ─────────────────────────────────────────────────────────

DIVISION_MAP = {
    # (live_name, shadow_name) -> canonical
    # Live-only divisions
    "Cardiovascular":       {"canonical": "Cardiovascular",         "shadow_matches": ["Cardiovascular"]},
    "Critical Care":        {"canonical": "Critical Care",          "shadow_matches": ["Critical Care"]},
    "Diagnostics":          {"canonical": "Diagnostics",            "shadow_matches": ["Diagnostics"]},
    "ENT":                  {"canonical": "ENT",                    "shadow_matches": ["ENT"]},
    "Endo-surgical":        {"canonical": "Endo Surgery",           "shadow_matches": ["Endo Surgery"]},
    "Infection Prevention": {"canonical": "Infection Prevention",   "shadow_matches": ["Infection Prevention"]},
    "Instruments":          {"canonical": "Instruments",            "shadow_matches": []},
    "Joint Replacement":    {"canonical": "Joint Replacement",      "shadow_matches": ["Joint Replacement"]},
    "Peripheral Intervention": {"canonical": "Peripheral Intervention", "shadow_matches": ["Endovascular", "Neuro-Endovascular"]},
    "Robotics":             {"canonical": "Robotics",               "shadow_matches": []},
    "Sports Medicine":      {"canonical": "Sports Medicine",        "shadow_matches": []},
    "Trauma":               {"canonical": "Trauma",                 "shadow_matches": ["Orthopedics / Trauma", "Trauma"]},
    "Urology":              {"canonical": "Urology",                "shadow_matches": []},
}

# Shadow-only divisions that need mapping
SHADOW_ONLY_DIVISIONS = {
    "Orthopedics / Spine": {"canonical": "Spine", "note": "New canonical division from shadow; no direct live equivalent"},
    "Various":             {"canonical": "_REVIEW", "note": "Shadow catch-all; needs manual product-level review"},
}


# ─────────────────────────────────────────────────────────
# 2. MATERIAL DICTIONARY
# ─────────────────────────────────────────────────────────

MATERIAL_CANONICAL_MAP = {
    # Titanium family
    "Titanium Alloy (TAN)": "Titanium Alloy (Ti-6Al-7Nb)",
    "Titanium alloy": "Titanium Alloy (Ti-6Al-7Nb)",
    "Titanium Alloy": "Titanium Alloy (Ti-6Al-7Nb)",
    "TAN(Ti-6Al-7Nb)": "Titanium Alloy (Ti-6Al-7Nb)",
    "TAN (Ti-6Al-7Nb)": "Titanium Alloy (Ti-6Al-7Nb)",
    "Titanium": "Titanium (Pure/CP)",
    "TiCP": "Titanium (Pure/CP)",
    "Titanium Ti-6Al-4V ELI": "Titanium Alloy (Ti-6Al-4V ELI)",
    "Ti-6Al-4V ELI": "Titanium Alloy (Ti-6Al-4V ELI)",
    "Titanium with TiNBn coating": "Titanium Alloy with TiNbN Coating",
    "Titanium staples": "Titanium (Pure/CP)",

    # Stainless Steel family
    "Stainless Steel": "Stainless Steel (Surgical Grade)",
    "Stainless steel": "Stainless Steel (Surgical Grade)",
    "Surgical grade steel": "Stainless Steel (Surgical Grade)",
    "Medical grade stainless steel and polymer": "Stainless Steel + Polymer Composite",
    "Medical grade stainless steel with special coating": "Stainless Steel (Coated)",
    "Stainles Steel": "Stainless Steel (Surgical Grade)",  # typo fix

    # Cobalt-Chromium
    "Cobalt-Chromium Alloy": "Cobalt-Chromium (CoCr)",
    "CoCr": "Cobalt-Chromium (CoCr)",
    "CoCr Alloy": "Cobalt-Chromium (CoCr)",
    "Cobalt-Chromium": "Cobalt-Chromium (CoCr)",

    # Polymer family
    "Polypropylene": "Polypropylene (PP)",
    "UHMWPE": "Ultra-High Molecular Weight Polyethylene (UHMWPE)",
    "Polyethylene": "Polyethylene",
    "PEEK": "Polyether Ether Ketone (PEEK)",

    # Reagent / Diagnostic
    "Chemical Reagent": "Chemical Reagent",
    "Immunochromatographic membrane": "Immunochromatographic Membrane",

    # Textile / Non-woven
    "Non-woven fabric": "Non-Woven Fabric (Medical Grade)",

    # Other
    "Not specified": "_UNSPECIFIED",
}


# ─────────────────────────────────────────────────────────
# 3. BRAND / MANUFACTURER NORMALIZATION
# ─────────────────────────────────────────────────────────

MANUFACTURER_CANONICAL_MAP = {
    "Meril": "Meril Life Sciences",
    "Meril Life Sciences": "Meril Life Sciences",
    "Meril Life Sciences Pvt. Ltd.": "Meril Life Sciences",
    "Meril Diagnostics": "Meril Life Sciences",
    "Meril Diagnostics Pvt. Ltd.": "Meril Life Sciences",
    "Meril Endo Surgery Private Limited": "Meril Life Sciences",
    "Meril Endo Surgery Pvt. Ltd.": "Meril Life Sciences",
    "Meril Endo Surgery Pvt.Ltd.": "Meril Life Sciences",
    "Meril Endo-Surgery Pvt. Ltd.": "Meril Life Sciences",
    "Meril Healthcare": "Meril Life Sciences",
    "Meril Healthcare Pvt. Ltd.": "Meril Life Sciences",
    "CLAVO": "Meril Life Sciences",
    "Freedom Knee": "Meril Life Sciences",
    "Maxx Medical": "Maxx Medical",
    "Maxx Orthopedics, Inc.": "Maxx Medical",
    "Not specified": "_UNSPECIFIED",
}

# Shadow brand -> canonical brand (preserving product brand identity)
# These are product brands under the Meril umbrella
SHADOW_BRAND_PARENT_MAP = {
    "Meril": "Meril Life Sciences",
    "Meril Critical Care": "Meril Life Sciences",
    "Meril Diagnostics": "Meril Life Sciences",
    "Meril Endo": "Meril Life Sciences",
    "Meril Endo Surgery": "Meril Life Sciences",
    "Meril Medical": "Meril Life Sciences",
    "Meril Orthopedics": "Meril Life Sciences",
    "Meril Surgical": "Meril Life Sciences",
    "Meril Sutures": "Meril Life Sciences",
    "Meril (AGFN System)": "Meril Life Sciences",
    "Vircell (distributed)": "Vircell (Distributed by Meril)",
}


def normalize_display_name(name):
    """Convert ALL CAPS to Title Case, preserve mixed case."""
    if not name:
        return name
    # If more than 60% uppercase letters, title-case it
    letters = [c for c in name if c.isalpha()]
    if not letters:
        return name
    upper_ratio = sum(1 for c in letters if c.isupper()) / len(letters)
    if upper_ratio > 0.6 and len(name) > 5:
        # Title case but preserve known acronyms
        acronyms = {"UHMWPE", "PEEK", "TAN", "SS", "CoCr", "CP", "ELI", "PTCA",
                     "TAVR", "AGFN", "IMCF", "PFIN", "PFRN", "PPH", "PCL", "PGA",
                     "PGCL", "IFU", "CE", "USFDA", "RF", "ENT", "HIV", "HCV", "HBV"}
        words = name.split()
        result = []
        for w in words:
            if w.upper() in acronyms or w in acronyms:
                result.append(w.upper())
            elif re.match(r'^\d', w):  # starts with digit
                result.append(w)
            elif re.match(r'^[A-Z]{2,5}\d', w):  # SKU-like
                result.append(w)
            else:
                result.append(w.capitalize())
        return " ".join(result)
    return name


async def build_division_map():
    """Build and store division mapping."""
    print("Building division mapping...")
    records = []

    for live_name, info in DIVISION_MAP.items():
        live_count = await db.products.count_documents({"division": live_name})
        shadow_count = 0
        for sm in info["shadow_matches"]:
            shadow_count += await db.shadow_products.count_documents({"division": sm})

        records.append({
            "division_live_original": live_name,
            "division_shadow_originals": info["shadow_matches"],
            "division_canonical": info["canonical"],
            "live_product_count": live_count,
            "shadow_product_count": shadow_count,
            "mapping_confidence": "high" if info["shadow_matches"] else "live_only",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    for shadow_name, info in SHADOW_ONLY_DIVISIONS.items():
        shadow_count = await db.shadow_products.count_documents({"division": shadow_name})
        records.append({
            "division_live_original": None,
            "division_shadow_originals": [shadow_name],
            "division_canonical": info["canonical"],
            "live_product_count": 0,
            "shadow_product_count": shadow_count,
            "mapping_confidence": "shadow_only",
            "note": info["note"],
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    await db.catalog_division_map.drop()
    if records:
        await db.catalog_division_map.insert_many(records)
    print(f"  Stored {len(records)} division mappings")
    return records


async def build_category_map():
    """Build and store category mapping."""
    print("Building category mapping...")
    records = []

    # Get all live division->category pairs
    live_divs = await db.products.distinct("division")
    for div in live_divs:
        cats = await db.products.distinct("category", {"division": div})
        canonical_div = DIVISION_MAP.get(div, {}).get("canonical", div)

        # Find shadow categories for this division
        shadow_matches = DIVISION_MAP.get(div, {}).get("shadow_matches", [])
        shadow_cats = []
        for sm in shadow_matches:
            sc = await db.shadow_products.distinct("sub_category", {"division": sm})
            shadow_cats.extend(sc)

        for cat in cats:
            live_count = await db.products.count_documents({"division": div, "category": cat})

            # Try to find shadow category match
            cat_lower = cat.lower().replace("-", " ").replace("_", " ")
            matched_shadow = None
            for sc in shadow_cats:
                sc_lower = sc.lower().replace("-", " ").replace("_", " ")
                if cat_lower in sc_lower or sc_lower in cat_lower:
                    matched_shadow = sc
                    break

            records.append({
                "division_canonical": canonical_div,
                "category_live_original": cat,
                "category_shadow_original": matched_shadow,
                "category_canonical": cat,  # Keep live naming as default canonical
                "display_name": normalize_display_name(cat),
                "live_product_count": live_count,
                "mapping_confidence": "high" if matched_shadow else "live_only",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

    # Shadow-only categories
    shadow_divs = await db.shadow_products.distinct("division")
    for sdiv in shadow_divs:
        scats = await db.shadow_products.distinct("sub_category", {"division": sdiv})
        # Find canonical division
        canonical_div = None
        for ld, info in DIVISION_MAP.items():
            if sdiv in info.get("shadow_matches", []):
                canonical_div = info["canonical"]
                break
        if not canonical_div:
            canonical_div = SHADOW_ONLY_DIVISIONS.get(sdiv, {}).get("canonical", sdiv)

        for scat in scats:
            # Check if already matched from live side
            already_matched = any(r["category_shadow_original"] == scat and r["division_canonical"] == canonical_div for r in records)
            if not already_matched:
                shadow_count = await db.shadow_products.count_documents({"division": sdiv, "sub_category": scat})
                records.append({
                    "division_canonical": canonical_div,
                    "category_live_original": None,
                    "category_shadow_original": scat,
                    "category_canonical": scat,
                    "display_name": normalize_display_name(scat),
                    "live_product_count": 0,
                    "shadow_product_count": shadow_count,
                    "mapping_confidence": "shadow_only",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })

    await db.catalog_category_map.drop()
    if records:
        await db.catalog_category_map.insert_many(records)
    print(f"  Stored {len(records)} category mappings")
    return records


async def build_material_dict():
    """Build and store material normalization dictionary."""
    print("Building material dictionary...")
    records = []

    # Get all unique materials from live products
    live_materials = await db.products.distinct("material")
    material_counts = Counter()
    for m in live_materials:
        if m:
            count = await db.products.count_documents({"material": m})
            material_counts[m] = count

    # Build records
    seen_canonical = defaultdict(list)
    for original, count in material_counts.most_common():
        canonical = MATERIAL_CANONICAL_MAP.get(original)
        if not canonical:
            # Try fuzzy matching
            o_lower = original.lower().strip()
            for key, val in MATERIAL_CANONICAL_MAP.items():
                if key.lower().strip() == o_lower:
                    canonical = val
                    break

        if not canonical:
            canonical = original  # Preserve as-is if no mapping

        seen_canonical[canonical].append(original)
        records.append({
            "material_original": original,
            "material_canonical": canonical,
            "display_name": normalize_display_name(canonical) if canonical != "_UNSPECIFIED" else "Not Specified",
            "live_product_count": count,
            "mapping_type": "dictionary" if original in MATERIAL_CANONICAL_MAP else "passthrough",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    await db.catalog_material_dict.drop()
    if records:
        await db.catalog_material_dict.insert_many(records)
    print(f"  Stored {len(records)} material mappings ({len(seen_canonical)} canonical groups)")
    return records


async def build_brand_dict():
    """Build and store brand/manufacturer normalization dictionary."""
    print("Building brand dictionary...")
    records = []

    # Live manufacturers
    live_mfrs = await db.products.distinct("manufacturer")
    for mfr in live_mfrs:
        if not mfr:
            continue
        count = await db.products.count_documents({"manufacturer": mfr})
        canonical = MANUFACTURER_CANONICAL_MAP.get(mfr, mfr)
        records.append({
            "source": "live",
            "field": "manufacturer",
            "brand_original": mfr,
            "brand_canonical": canonical,
            "parent_company": canonical,
            "is_product_brand": False,
            "live_product_count": count,
            "shadow_product_count": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Shadow brands (these are product-level brands)
    shadow_brands = await db.shadow_products.distinct("brand")
    for brand in shadow_brands:
        if not brand:
            continue
        count = await db.shadow_products.count_documents({"brand": brand})
        parent = SHADOW_BRAND_PARENT_MAP.get(brand, "Meril Life Sciences")
        records.append({
            "source": "shadow",
            "field": "brand",
            "brand_original": brand,
            "brand_canonical": brand,  # Product brands keep their identity
            "parent_company": parent,
            "is_product_brand": brand not in SHADOW_BRAND_PARENT_MAP,
            "live_product_count": 0,
            "shadow_product_count": count,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    await db.catalog_brand_dict.drop()
    if records:
        await db.catalog_brand_dict.insert_many(records)
    print(f"  Stored {len(records)} brand/manufacturer entries")
    return records


async def build_product_family_map():
    """Build product family mapping with confidence scoring."""
    print("Building product family mapping...")
    records = []

    # Get all live product families with their products
    pipeline = [
        {"$group": {
            "_id": "$product_family",
            "count": {"$sum": 1},
            "division": {"$first": "$division"},
            "category": {"$first": "$category"},
            "sample_names": {"$push": "$product_name"},
            "sample_skus": {"$push": "$sku_code"},
        }},
        {"$sort": {"count": -1}},
    ]
    cursor = db.products.aggregate(pipeline)
    async for group in cursor:
        family_name = group["_id"]
        if not family_name:
            continue

        count = group["count"]
        division = group.get("division", "")
        canonical_div = DIVISION_MAP.get(division, {}).get("canonical", division)

        # Determine grouping quality
        if count == 1:
            confidence = "singleton"
            method = "name_equals_family"
        elif count >= 3:
            confidence = "high"
            method = "multi_variant_group"
        else:
            confidence = "medium"
            method = "small_group"

        # Try to match with shadow brand
        matched_shadow_brand = None
        family_lower = family_name.lower()
        shadow_brands = await db.shadow_products.distinct("brand")
        for sb in shadow_brands:
            if sb.lower() in family_lower:
                matched_shadow_brand = sb
                break

        display = normalize_display_name(family_name)

        records.append({
            "product_family_live_original": family_name,
            "product_family_canonical": display,
            "product_family_display": display,
            "division_canonical": canonical_div,
            "category": group.get("category", ""),
            "matched_shadow_brand": matched_shadow_brand,
            "variant_count": count,
            "product_family_confidence": confidence,
            "family_grouping_method": method,
            "sample_product_names": group["sample_names"][:5],
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    await db.catalog_product_family_map.drop()
    if records:
        await db.catalog_product_family_map.insert_many(records)
    print(f"  Stored {len(records)} product family mappings")

    # Stats
    conf_counts = Counter(r["product_family_confidence"] for r in records)
    for conf, cnt in conf_counts.most_common():
        print(f"    {conf}: {cnt}")

    return records


async def build_master_taxonomy():
    """Build the master taxonomy summary."""
    print("Building master taxonomy summary...")

    div_map = await db.catalog_division_map.count_documents({})
    cat_map = await db.catalog_category_map.count_documents({})
    mat_dict = await db.catalog_material_dict.count_documents({})
    brand_dict = await db.catalog_brand_dict.count_documents({})
    family_map = await db.catalog_product_family_map.count_documents({})

    # Count safely mappable products
    live_total = await db.products.count_documents({})
    shadow_total = await db.shadow_products.count_documents({})

    # Products with known division mapping
    safe_divisions = [d for d, info in DIVISION_MAP.items() if info.get("shadow_matches")]
    safe_count = 0
    for d in safe_divisions:
        safe_count += await db.products.count_documents({"division": d})

    ambiguous_count = live_total - safe_count

    summary = {
        "phase": "Phase 1 - Taxonomy Mapping",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "collections_created": {
            "catalog_division_map": div_map,
            "catalog_category_map": cat_map,
            "catalog_material_dict": mat_dict,
            "catalog_brand_dict": brand_dict,
            "catalog_product_family_map": family_map,
        },
        "live_catalog": {
            "total_products": live_total,
            "divisions": len(await db.products.distinct("division")),
            "categories": len(await db.products.distinct("category")),
        },
        "shadow_catalog": {
            "total_products": shadow_total,
            "total_skus": await db.shadow_skus.count_documents({}),
            "total_brands": len(await db.shadow_products.distinct("brand")),
            "divisions": len(await db.shadow_products.distinct("division")),
        },
        "mapping_quality": {
            "safely_mappable_products": safe_count,
            "ambiguous_products": ambiguous_count,
            "safely_mappable_pct": round(safe_count / live_total * 100, 1) if live_total else 0,
        },
        "unresolved_mappings": {
            "shadow_only_divisions": list(SHADOW_ONLY_DIVISIONS.keys()),
            "live_only_divisions": [d for d, info in DIVISION_MAP.items() if not info.get("shadow_matches")],
        },
    }

    await db.catalog_taxonomy.drop()
    await db.catalog_taxonomy.insert_one(summary)
    print(f"\n{'='*60}")
    print(f"PHASE 1 COMPLETE")
    print(f"{'='*60}")
    print(f"Division mappings:       {div_map}")
    print(f"Category mappings:       {cat_map}")
    print(f"Material dictionary:     {mat_dict}")
    print(f"Brand dictionary:        {brand_dict}")
    print(f"Product family mappings: {family_map}")
    print(f"")
    print(f"Safely mappable:  {safe_count}/{live_total} ({summary['mapping_quality']['safely_mappable_pct']}%)")
    print(f"Ambiguous:        {ambiguous_count}/{live_total}")
    print(f"")
    print(f"Unresolved shadow-only divisions: {SHADOW_ONLY_DIVISIONS.keys()}")
    print(f"Live-only divisions (no shadow):  {summary['unresolved_mappings']['live_only_divisions']}")

    return summary


async def main():
    print("=" * 60)
    print("PHASE 1: TAXONOMY MAPPING & NORMALIZATION")
    print("=" * 60)
    print()

    await build_division_map()
    print()
    await build_category_map()
    print()
    await build_material_dict()
    print()
    await build_brand_dict()
    print()
    await build_product_family_map()
    print()
    await build_master_taxonomy()


if __name__ == "__main__":
    asyncio.run(main())
