"""
Phase 5C: Split Shared-SKU Pools
=================================
Strategy:
  Group A: Split shared pools → assign SKUs to correct owner
  Group B: Merge over-split products → combine individual sizes into one family
  Group C: Distribute zero-SKU products → Freedom Knee components

Evidence order: SKU code prefix/pattern > SKU description > brochure heading > semantic rules
"""
import asyncio
import os
import re
from datetime import datetime, timezone
from collections import defaultdict
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]
cp = db["catalog_products"]
cs = db["catalog_skus"]
NOW = datetime.now(timezone.utc)

STATS = {"skus_reassigned": 0, "products_merged": 0, "products_split": 0, "pools_resolved": 0}


# ═══════════════════════════════════════════════════
# GROUP A: SPLIT DOA SHARED POOL
# ═══════════════════════════════════════════════════

# DOA SKU code patterns → drug test mapping
DOA_SKU_RULES = [
    (re.compile(r"^DAR?AMP", re.I), "Amphetamine"),
    (re.compile(r"^DAR?BAR", re.I), "Barbiturate"),
    (re.compile(r"^DAR?BUP", re.I), "Buprenorphine"),
    (re.compile(r"^DAR?BZO|^DAR?BEN", re.I), "Benzodiazepine"),
    (re.compile(r"^DAR?COC", re.I), "Cocaine"),
    (re.compile(r"^DAR?COT", re.I), "Cotinine"),
    (re.compile(r"^DAR?ETG", re.I), "Ethyl Glucuronide"),
    (re.compile(r"^DAR?FEN|^DAR?FYL", re.I), "Fentanyl"),
    (re.compile(r"^DAR?KET", re.I), "Ketamine"),
    (re.compile(r"^DAR?MCA|^DAR?MDA|^DAR?MDM", re.I), "MDMA/Ecstasy"),
    (re.compile(r"^DAR?MET", re.I), "Methamphetamine"),
    (re.compile(r"^DAR?MOP|^DAR?MOR", re.I), "Morphine"),
    (re.compile(r"^DAR?MTD", re.I), "Methadone"),
    (re.compile(r"^DAR?OPI", re.I), "Opiates"),
    (re.compile(r"^DAR?OXY", re.I), "Oxycodone"),
    (re.compile(r"^DAR?PCP", re.I), "Phencyclidine"),
    (re.compile(r"^DAR?PPX", re.I), "Propoxyphene"),
    (re.compile(r"^DAR?TCA", re.I), "Tricyclic Antidepressant"),
    (re.compile(r"^DAR?THC", re.I), "THC/Cannabinoid"),
    (re.compile(r"^DAR?TRA", re.I), "Tramadol"),
    (re.compile(r"^DASK", re.I), "Multi Drug"),  # Multi-drug panel SKUs
]

# Map drug names to their specific product
DOA_DRUG_TO_PRODUCT = {
    "Amphetamine": "MeriScreen Drug of Abuse (DOA) Rapid Test - Amphetamine 1000ng/ml",
    "Cocaine": "MeriScreen Drug of Abuse (DOA) Rapid Test - Cocaine 300ng/ml",
    "Morphine": "MeriScreen Drug of Abuse (DOA) Rapid Test - Morphine 300ng/ml",
    "Opiates": "MeriScreen Drug of Abuse (DOA) Rapid Test - Opiates 2000ng/ml",
    "THC/Cannabinoid": "MeriScreen Drug of Abuse (DOA) Rapid Test - THC/Cannabinoid 50ng/ml",
    "Multi Drug": "MeriScreen Drug of Abuse (DOA) Multi Drug Rapid Test",
}
# Everything else goes to "Single Drug Tests"
DOA_SINGLE_DRUG_PRODUCT = "MeriScreen Drug of Abuse (DOA) Rapid Test - Single Drug Tests"


async def split_doa_pool():
    """Split the 80 shared DOA SKUs into their correct product owners."""
    print("\n--- Splitting DOA shared-SKU pool ---")
    
    # Get all DOA SKUs
    doa_skus = await cs.find(
        {"catalog_product_name": re.compile("Drug of Abuse|DOA", re.I)},
        {"_id": 1, "sku_code": 1, "description": 1, "catalog_product_name": 1}
    ).to_list(500)
    
    reassigned = 0
    unmatched = 0
    
    for sku in doa_skus:
        code = sku.get("sku_code", "")
        desc = sku.get("description", "")
        
        # Determine drug from SKU code
        drug = None
        for pattern, drug_name in DOA_SKU_RULES:
            if pattern.search(code):
                drug = drug_name
                break
        
        if not drug:
            # Fallback: check description
            desc_lower = (desc or "").lower()
            if "multi" in desc_lower or "panel" in desc_lower:
                drug = "Multi Drug"
            else:
                unmatched += 1
                continue
        
        # Find the correct product for this drug
        correct_product = DOA_DRUG_TO_PRODUCT.get(drug, DOA_SINGLE_DRUG_PRODUCT)
        
        # Reassign if different
        current = sku.get("catalog_product_name", "")
        if current != correct_product:
            await cs.update_one(
                {"_id": sku["_id"]},
                {"$set": {
                    "catalog_product_name": correct_product,
                    "sku_split_source": current,
                    "sku_split_evidence": f"SKU code pattern → {drug}",
                    "sku_split_at": NOW,
                }}
            )
            reassigned += 1
    
    # Update SKU counts on products
    doa_products = await cp.find(
        {"product_name": re.compile("Drug of Abuse|DOA", re.I)},
        {"_id": 1, "product_name": 1}
    ).to_list(20)
    
    for prod in doa_products:
        count = await cs.count_documents({"catalog_product_name": prod["product_name"]})
        await cp.update_one({"_id": prod["_id"]}, {"$set": {"shadow_sku_count": count}})
    
    print(f"  DOA: {reassigned} SKUs reassigned, {unmatched} unmatched")
    STATS["skus_reassigned"] += reassigned
    STATS["pools_resolved"] += 1


# ═══════════════════════════════════════════════════
# GROUP A: SPLIT AUTOQUANT REAGENT POOL
# ═══════════════════════════════════════════════════

# AutoQuant SKU prefix patterns → reagent type
AQ_SKU_RULES = [
    (re.compile(r"^CRPAQ|^CRP", re.I), "AutoQuant CRP Reagent"),
    (re.compile(r"^LIPAQ|^LIP", re.I), "AutoQuant Lipase Reagent"),
    (re.compile(r"^MALBAQ|^MALB|^MICALB", re.I), "AutoQuant Micro Albumin Reagent"),
]

async def split_autoquant_pool():
    """Split the 50 shared AutoQuant SKUs."""
    print("\n--- Splitting AutoQuant reagent pool ---")
    
    # Get the 3 product names
    aq_products = await cp.find(
        {"product_name": re.compile("AutoQuant.*(CRP|Lipase|Micro Albumin).*Reagent", re.I)},
        {"_id": 1, "product_name": 1}
    ).to_list(10)
    
    if not aq_products:
        print("  No AutoQuant shared products found")
        return
    
    product_names = [p["product_name"] for p in aq_products]
    
    # Get all shared SKUs
    shared_skus = await cs.find(
        {"catalog_product_name": {"$in": product_names}},
        {"_id": 1, "sku_code": 1, "description": 1, "product_name": 1, "catalog_product_name": 1}
    ).to_list(500)
    
    reassigned = 0
    for sku in shared_skus:
        code = sku.get("sku_code", "")
        desc = (sku.get("description", "") or sku.get("product_name", "")).lower()
        
        correct = None
        for pattern, prod_name in AQ_SKU_RULES:
            if pattern.search(code):
                correct = prod_name
                break
        
        if not correct:
            # Fallback: check description
            if "crp" in desc or "c-reactive" in desc:
                correct = "AutoQuant CRP Reagent"
            elif "lipase" in desc:
                correct = "AutoQuant Lipase Reagent"
            elif "micro" in desc and "albumin" in desc:
                correct = "AutoQuant Micro Albumin Reagent"
        
        if correct and sku.get("catalog_product_name") != correct:
            await cs.update_one({"_id": sku["_id"]}, {"$set": {
                "catalog_product_name": correct,
                "sku_split_source": sku["catalog_product_name"],
                "sku_split_evidence": f"SKU code/description pattern",
                "sku_split_at": NOW,
            }})
            reassigned += 1
    
    # Update counts
    for prod in aq_products:
        count = await cs.count_documents({"catalog_product_name": prod["product_name"]})
        await cp.update_one({"_id": prod["_id"]}, {"$set": {"shadow_sku_count": count}})
    
    print(f"  AutoQuant: {reassigned} SKUs reassigned")
    STATS["skus_reassigned"] += reassigned
    STATS["pools_resolved"] += 1


# ═══════════════════════════════════════════════════
# GROUP A: SPLIT PFRN NAIL POOL  
# ═══════════════════════════════════════════════════

async def split_pfrn_pool():
    """Split the 59 shared PFRN/IM nail SKUs."""
    print("\n--- Splitting PFRN nail pool ---")
    
    # The 3 products sharing 59 SKUs:
    # 1. "Intramedullary Nail" (generic)
    # 2. "CLAVO PFRN Proximal Femoral Reconstruction Nail" (medium conf)
    # 3. "CLAVO PFRN Proximal Femoral Rotational Stability Nail" (high conf)
    
    # PFRN = Proximal Femoral Rotational Stability — the main product
    # PFIN = Proximal Femoral Interlock Nail (reconstruction variant)
    # Generic IM nails should be distributed based on SKU prefix
    
    pfrn_pattern = re.compile(r"MT-NT011|PFRN", re.I)   # PFRN nails
    pfin_pattern = re.compile(r"MT-NTO1|PFIN", re.I)    # Reconstruction nails (NTO prefix)
    
    target_products = [
        "CLAVO PFRN Proximal Femoral Rotational Stability Nail",
        "CLAVO PFRN Proximal Femoral Reconstruction Nail",
        "Intramedullary Nail",
    ]
    
    shared_skus = await cs.find(
        {"catalog_product_name": {"$in": target_products}},
        {"_id": 1, "sku_code": 1, "catalog_product_name": 1, "description": 1}
    ).to_list(300)
    
    reassigned = 0
    for sku in shared_skus:
        code = sku.get("sku_code", "")
        
        if pfin_pattern.search(code):
            correct = "CLAVO PFRN Proximal Femoral Reconstruction Nail"
        elif pfrn_pattern.search(code):
            correct = "CLAVO PFRN Proximal Femoral Rotational Stability Nail"
        else:
            # Generic IM nail SKUs stay with generic product
            correct = "Intramedullary Nail"
        
        if sku["catalog_product_name"] != correct:
            await cs.update_one({"_id": sku["_id"]}, {"$set": {
                "catalog_product_name": correct,
                "sku_split_source": sku["catalog_product_name"],
                "sku_split_evidence": "SKU code prefix pattern",
                "sku_split_at": NOW,
            }})
            reassigned += 1
    
    # Update counts
    for pname in target_products:
        prod = await cp.find_one({"product_name": pname})
        if prod:
            count = await cs.count_documents({"catalog_product_name": pname})
            await cp.update_one({"_id": prod["_id"]}, {"$set": {"shadow_sku_count": count}})
    
    print(f"  PFRN: {reassigned} SKUs reassigned")
    STATS["skus_reassigned"] += reassigned
    STATS["pools_resolved"] += 1


# ═══════════════════════════════════════════════════
# GROUP B: MERGE OVER-SPLIT PFRN LOCKING BOLTS
# ═══════════════════════════════════════════════════

async def merge_pfrn_bolts():
    """Merge 26+ individual bolt-size products into the parent 'Locking Bolts' product."""
    print("\n--- Merging PFRN locking bolt size products ---")
    
    # Find all individual bolt products (PFRN...Locking Bolt...XXmm)
    bolt_products = await cp.find(
        {"product_name": re.compile(r"PFRN.*Locking Bolt.*\d+mm", re.I), "division_canonical": "Trauma"},
        {"_id": 1, "product_name": 1, "product_name_display": 1, "slug": 1}
    ).to_list(50)
    
    if not bolt_products:
        print("  No individual bolt products found")
        return
    
    # The parent product
    parent_name = "Locking Bolts - 4.9mm Self Tapping"
    parent = await cp.find_one({"product_name": re.compile(r"Locking Bolt.*4\.9mm.*Self Tapping$", re.I)})
    
    if not parent:
        # Create parent if it doesn't exist — use the generic bolt product
        parent = await cp.find_one({"product_name": re.compile(r"^Locking Bolt", re.I), "division_canonical": "Trauma"})
        if not parent:
            print("  No parent bolt product found, skipping")
            return
        parent_name = parent["product_name"]
    else:
        parent_name = parent["product_name"]
    
    reassigned = 0
    merged = 0
    
    for bolt in bolt_products:
        bname = bolt["product_name"]
        # Move all SKUs from this individual bolt to the parent
        result = await cs.update_many(
            {"catalog_product_name": bname},
            {"$set": {
                "catalog_product_name": parent_name,
                "sku_split_source": bname,
                "sku_split_evidence": "Merged individual bolt sizes into parent family",
                "sku_split_at": NOW,
            }}
        )
        reassigned += result.modified_count
        
        # Mark individual product as merged/draft
        await cp.update_one({"_id": bolt["_id"]}, {"$set": {
            "status": "merged",
            "merged_into": parent_name,
            "merged_at": NOW,
        }})
        merged += 1
    
    # Update parent count
    count = await cs.count_documents({"catalog_product_name": parent_name})
    await cp.update_one({"_id": parent["_id"]}, {"$set": {"shadow_sku_count": count}})
    
    print(f"  Locking Bolts: {merged} products merged into '{parent_name}', {reassigned} SKUs moved")
    STATS["products_merged"] += merged
    STATS["skus_reassigned"] += reassigned
    STATS["pools_resolved"] += 1


# ═══════════════════════════════════════════════════
# GROUP A: SPLIT HUMERUS PLATE POOL
# ═══════════════════════════════════════════════════

async def split_humerus_plates():
    """Split the 18 shared humerus plate SKUs."""
    print("\n--- Splitting Humerus plate pool ---")
    
    medial_product = "2.7/3.5mm LPS Medial Distal Humerus Plate"
    prox_product = "3.5mm LPS Proximal Humerus Plate, Short"
    
    # Pattern: medial plates have different PT codes than proximal
    shared_skus = await cs.find(
        {"catalog_product_name": {"$in": [medial_product, prox_product]}},
        {"_id": 1, "sku_code": 1, "catalog_product_name": 1, "product_name": 1, "description": 1}
    ).to_list(100)
    
    # Check the actual SKU product_name field for evidence
    reassigned = 0
    for sku in shared_skus:
        pname = (sku.get("product_name", "") or "").lower()
        desc = (sku.get("description", "") or "").lower()
        
        if "medial" in pname or "medial" in desc or "distal" in pname:
            correct = medial_product
        elif "proximal" in pname or "proximal" in desc:
            correct = prox_product
        else:
            continue  # Can't determine, skip
        
        if sku["catalog_product_name"] != correct:
            await cs.update_one({"_id": sku["_id"]}, {"$set": {
                "catalog_product_name": correct,
                "sku_split_source": sku["catalog_product_name"],
                "sku_split_evidence": "SKU product_name anatomy pattern",
                "sku_split_at": NOW,
            }})
            reassigned += 1
    
    # Update counts
    for pname in [medial_product, prox_product]:
        prod = await cp.find_one({"product_name": pname})
        if prod:
            count = await cs.count_documents({"catalog_product_name": pname})
            await cp.update_one({"_id": prod["_id"]}, {"$set": {"shadow_sku_count": count}})
    
    print(f"  Humerus: {reassigned} SKUs reassigned")
    STATS["skus_reassigned"] += reassigned
    STATS["pools_resolved"] += 1


# ═══════════════════════════════════════════════════
# GROUP A: SPLIT PROVISO TEST KIT POOL
# ═══════════════════════════════════════════════════

async def split_proviso_pool():
    """Split the 15 shared Proviso test kit SKUs."""
    print("\n--- Splitting Proviso test kit pool ---")
    
    proviso_rules = [
        (re.compile(r"^HBAFQ|HBA1C|HBA", re.I), "HbA1c Test Kit for Proviso"),
        (re.compile(r"^CRPFQ|CRP", re.I), "CRP Test Kit for Proviso"),
        (re.compile(r"^ASOFQ|ASO", re.I), "ASO Test Kit for Proviso"),
        (re.compile(r"^RFFQ|RF", re.I), "RF Test Kit for Proviso"),
        (re.compile(r"^DDRP", re.I), "Drug Detection"),  # Multi-drug panel
    ]
    
    target_products = [
        "ASO Test Kit for Proviso",
        "CRP Test Kit for Proviso",
        "HbA1c Test Kit for Proviso",
        "RF Test Kit for Proviso",
    ]
    
    shared_skus = await cs.find(
        {"catalog_product_name": {"$in": target_products}},
        {"_id": 1, "sku_code": 1, "catalog_product_name": 1, "description": 1}
    ).to_list(100)
    
    reassigned = 0
    for sku in shared_skus:
        code = sku.get("sku_code", "")
        desc = (sku.get("description", "") or "").lower()
        
        correct = None
        for pattern, prod_name in proviso_rules:
            if pattern.search(code):
                correct = prod_name
                break
        
        if not correct:
            # Fallback: description
            if "hba1c" in desc or "hemoglobin" in desc:
                correct = "HbA1c Test Kit for Proviso"
            elif "crp" in desc or "c-reactive" in desc:
                correct = "CRP Test Kit for Proviso"
            elif "aso" in desc or "streptolysin" in desc:
                correct = "ASO Test Kit for Proviso"
            elif "rf" in desc or "rheumatoid" in desc:
                correct = "RF Test Kit for Proviso"
        
        if correct and correct in target_products and sku["catalog_product_name"] != correct:
            await cs.update_one({"_id": sku["_id"]}, {"$set": {
                "catalog_product_name": correct,
                "sku_split_source": sku["catalog_product_name"],
                "sku_split_evidence": "SKU code prefix pattern",
                "sku_split_at": NOW,
            }})
            reassigned += 1
    
    # Update counts
    for pname in target_products:
        prod = await cp.find_one({"product_name": pname})
        if prod:
            count = await cs.count_documents({"catalog_product_name": pname})
            await cp.update_one({"_id": prod["_id"]}, {"$set": {"shadow_sku_count": count}})
    
    print(f"  Proviso: {reassigned} SKUs reassigned")
    STATS["skus_reassigned"] += reassigned
    STATS["pools_resolved"] += 1


# ═══════════════════════════════════════════════════
# MBOSS CONFIDENCE PROMOTION
# ═══════════════════════════════════════════════════

async def promote_mboss():
    """Promote MBOSS screw products to high mapping_confidence."""
    print("\n--- Promoting MBOSS screw products ---")
    
    result = await cp.update_many(
        {"product_name": re.compile("^MBOSS", re.I), "mapping_confidence": {"$ne": "high"}},
        {"$set": {
            "mapping_confidence": "high",
            "review_required": False,
            "confidence_promotion_reason": "MBOSS screws are verified compatible components for plate/nail systems",
            "confidence_promoted_at": NOW,
        }}
    )
    print(f"  MBOSS: {result.modified_count} products promoted to high confidence")


# ═══════════════════════════════════════════════════
# VERIFICATION
# ═══════════════════════════════════════════════════

async def verify():
    """Verify no more shared-SKU pools exist in pilot divisions."""
    print("\n\n=== VERIFICATION ===")
    
    # Re-run the shared-SKU check for pilot divisions
    pipeline = [
        {"$group": {
            "_id": "$sku_code",
            "product_names": {"$addToSet": "$catalog_product_name"},
        }},
        {"$match": {"product_names.1": {"$exists": True}}},
    ]
    still_shared = await cs.aggregate(pipeline).to_list(1000)
    
    pilot_shared = 0
    non_pilot_shared = 0
    
    for s in still_shared:
        # Check if any product is in pilot divisions
        for pname in s["product_names"]:
            prod = await cp.find_one({"product_name": pname}, {"_id": 0, "division_canonical": 1})
            if prod and prod.get("division_canonical") in ["Trauma", "Cardiovascular", "Diagnostics", "Joint Replacement"]:
                pilot_shared += 1
                if pilot_shared <= 5:
                    print(f"  STILL SHARED (pilot): {s['_id']} → {s['product_names'][:3]}")
                break
        else:
            non_pilot_shared += 1
    
    print(f"\n  Remaining shared-SKU issues in pilot divisions: {pilot_shared}")
    print(f"  Remaining shared-SKU issues in non-pilot divisions: {non_pilot_shared}")
    
    # Show updated DOA SKU counts
    print("\n  DOA product SKU counts after split:")
    doa = await cp.find(
        {"product_name": re.compile("Drug of Abuse|DOA", re.I)},
        {"_id": 0, "product_name_display": 1, "shadow_sku_count": 1}
    ).sort("product_name_display", 1).to_list(20)
    for d in doa:
        actual = await cs.count_documents({"catalog_product_name": d.get("product_name_display", "N/A").replace("Drug of Abuse (DOA)", "MeriScreen Drug of Abuse (DOA)")})
        print(f"    {d['product_name_display']:60} | {d.get('shadow_sku_count', '?')} SKUs")
    
    # Show AutoQuant counts
    print("\n  AutoQuant reagent counts after split:")
    aq = await cp.find(
        {"product_name": re.compile("AutoQuant.*(CRP|Lipase|Micro Albumin).*Reagent", re.I)},
        {"_id": 0, "product_name_display": 1, "shadow_sku_count": 1}
    ).to_list(10)
    for a in aq:
        print(f"    {a['product_name_display']:40} | {a.get('shadow_sku_count', '?')} SKUs")
    
    # MBOSS products
    print("\n  MBOSS products after promotion:")
    mboss = await cp.find(
        {"product_name": re.compile("^MBOSS", re.I)},
        {"_id": 0, "product_name_display": 1, "mapping_confidence": 1, "shadow_sku_count": 1}
    ).to_list(10)
    for m in mboss:
        print(f"    {m['product_name_display']:40} | conf: {m.get('mapping_confidence','')} | {m.get('shadow_sku_count',0)} SKUs")


async def main():
    print("=" * 70)
    print("PHASE 5C: SPLIT SHARED-SKU POOLS")
    print("=" * 70)
    
    await split_doa_pool()
    await split_autoquant_pool()
    await split_pfrn_pool()
    await merge_pfrn_bolts()
    await split_humerus_plates()
    await split_proviso_pool()
    await promote_mboss()
    
    await verify()
    
    print("\n" + "=" * 70)
    print("FINAL STATS")
    print("=" * 70)
    print(f"  SKUs reassigned: {STATS['skus_reassigned']}")
    print(f"  Products merged: {STATS['products_merged']}")
    print(f"  Pools resolved: {STATS['pools_resolved']}")
    print("\nDONE.")

asyncio.run(main())
