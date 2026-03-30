"""Fix DOA SKU naming to match canonical product_name, and fix remaining shared issues."""
import asyncio, os, re
from datetime import datetime, timezone
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]
cp = db["catalog_products"]
cs = db["catalog_skus"]
NOW = datetime.now(timezone.utc)


async def fix_doa_case():
    """Fix case mismatch: MeriScreen → MERISCREEN in SKU catalog_product_name."""
    print("--- Fixing DOA case mismatch ---")
    
    # Map MeriScreen → MERISCREEN
    replacements = [
        ("MeriScreen Drug of Abuse (DOA) Multi Drug Rapid Test", "MERISCREEN Drug of Abuse (DOA) Multi Drug Rapid Test"),
        ("MeriScreen Drug of Abuse (DOA) Rapid Test - Amphetamine 1000ng/ml", "MERISCREEN Drug of Abuse (DOA) Rapid Test - Amphetamine 1000ng/ml"),
        ("MeriScreen Drug of Abuse (DOA) Rapid Test - Cocaine 300ng/ml", "MERISCREEN Drug of Abuse (DOA) Rapid Test - Cocaine 300ng/ml"),
        ("MeriScreen Drug of Abuse (DOA) Rapid Test - Morphine 300ng/ml", "MERISCREEN Drug of Abuse (DOA) Rapid Test - Morphine 300ng/ml"),
        ("MeriScreen Drug of Abuse (DOA) Rapid Test - Opiates 2000ng/ml", "MERISCREEN Drug of Abuse (DOA) Rapid Test - Opiates 2000ng/ml"),
        ("MeriScreen Drug of Abuse (DOA) Rapid Test - Single Drug Tests", "MERISCREEN Drug of Abuse (DOA) Rapid Test - Single Drug Tests"),
        ("MeriScreen Drug of Abuse (DOA) Rapid Test - THC/Cannabinoid 50ng/ml", "MERISCREEN Drug of Abuse (DOA) Rapid Test - THC/Cannabinoid 50ng/ml"),
    ]
    
    total = 0
    for old, new in replacements:
        result = await cs.update_many(
            {"catalog_product_name": old},
            {"$set": {"catalog_product_name": new}}
        )
        if result.modified_count:
            total += result.modified_count
            print(f"  Fixed {result.modified_count}: {old} → {new}")
    
    # Update SKU counts on products
    doa_products = await cp.find(
        {"product_name": re.compile("MERISCREEN.*Drug of Abuse", re.I)},
        {"_id": 1, "product_name": 1}
    ).to_list(20)
    
    for prod in doa_products:
        count = await cs.count_documents({"catalog_product_name": prod["product_name"]})
        await cp.update_one({"_id": prod["_id"]}, {"$set": {"shadow_sku_count": count}})
        print(f"  {prod['product_name']}: {count} SKUs")
    
    print(f"  Total fixed: {total}")


async def fix_duplicate_humerus():
    """Fix duplicate posterolateral humerus products (different slug spellings)."""
    print("\n--- Fixing duplicate humerus products ---")
    
    dupes = await cp.find(
        {"product_name": re.compile("Posterolateral.*Distal.*Humerus", re.I)},
        {"_id": 1, "product_name": 1, "product_name_display": 1, "slug": 1, "mapping_confidence": 1}
    ).to_list(10)
    
    if len(dupes) <= 1:
        print("  No duplicates found")
        return
    
    print(f"  Found {len(dupes)} duplicates:")
    for d in dupes:
        count = await cs.count_documents({"catalog_product_name": d["product_name"]})
        print(f"    {d['product_name']} | slug: {d['slug']} | conf: {d.get('mapping_confidence','')} | {count} SKUs")
    
    # Keep the one with more SKUs or higher confidence
    keep = dupes[0]
    for d in dupes[1:]:
        keep_count = await cs.count_documents({"catalog_product_name": keep["product_name"]})
        d_count = await cs.count_documents({"catalog_product_name": d["product_name"]})
        if d_count > keep_count or (d.get("mapping_confidence") == "high" and keep.get("mapping_confidence") != "high"):
            # Merge keep into d
            await cs.update_many(
                {"catalog_product_name": keep["product_name"]},
                {"$set": {"catalog_product_name": d["product_name"]}}
            )
            await cp.update_one({"_id": keep["_id"]}, {"$set": {"status": "merged", "merged_into": d["product_name"]}})
            keep = d
        else:
            # Merge d into keep
            await cs.update_many(
                {"catalog_product_name": d["product_name"]},
                {"$set": {"catalog_product_name": keep["product_name"]}}
            )
            await cp.update_one({"_id": d["_id"]}, {"$set": {"status": "merged", "merged_into": keep["product_name"]}})
    
    final_count = await cs.count_documents({"catalog_product_name": keep["product_name"]})
    await cp.update_one({"_id": keep["_id"]}, {"$set": {"shadow_sku_count": final_count}})
    print(f"  Kept: {keep['product_name']} with {final_count} SKUs")


async def verify_final():
    """Final verification of pilot division shared-SKU status."""
    print("\n\n=== FINAL VERIFICATION ===")
    
    # Check DOA
    print("\n  DOA Products:")
    doa = await cp.find(
        {"product_name": re.compile("Drug of Abuse", re.I), "status": {"$ne": "merged"}},
        {"_id": 0, "product_name_display": 1, "shadow_sku_count": 1, "product_name": 1}
    ).sort("product_name_display", 1).to_list(20)
    for d in doa:
        actual = await cs.count_documents({"catalog_product_name": d["product_name"]})
        print(f"    {d['product_name_display']:60} | {actual} SKUs")
    
    # Check AutoQuant
    print("\n  AutoQuant Reagents:")
    aq = await cp.find(
        {"product_name": re.compile("AutoQuant.*(CRP|Lipase|Micro Albumin)", re.I), "status": {"$ne": "merged"}},
        {"_id": 0, "product_name_display": 1, "shadow_sku_count": 1, "product_name": 1}
    ).to_list(10)
    for a in aq:
        actual = await cs.count_documents({"catalog_product_name": a["product_name"]})
        print(f"    {a['product_name_display']:40} | {actual} SKUs")
    
    # Check PFRN
    print("\n  PFRN Nails:")
    pfrn = await cp.find(
        {"product_name": re.compile("PFRN|Intramedullary Nail", re.I), "division_canonical": "Trauma", "status": {"$ne": "merged"}},
        {"_id": 0, "product_name_display": 1, "shadow_sku_count": 1, "product_name": 1}
    ).to_list(10)
    for p in pfrn:
        actual = await cs.count_documents({"catalog_product_name": p["product_name"]})
        print(f"    {p['product_name_display']:60} | {actual} SKUs")
    
    # MBOSS
    print("\n  MBOSS (after promotion):")
    mboss = await cp.find(
        {"product_name": re.compile("^MBOSS", re.I)},
        {"_id": 0, "product_name_display": 1, "mapping_confidence": 1}
    ).to_list(10)
    for m in mboss:
        print(f"    {m['product_name_display']:40} | conf: {m['mapping_confidence']}")
    
    # Related products check — do compatible screws show now?
    print("\n  Related Products check (AURIC plate):")
    from routes.catalog import catalog_products_col, PILOT_FILTER, MIN_CONFIDENCE
    mboss_in_pilot = await catalog_products_col.find({
        **PILOT_FILTER,
        "semantic_brand_system": "MBOSS",
        "semantic_confidence": {"$gte": MIN_CONFIDENCE},
    }, {"_id": 0, "product_name_display": 1}).to_list(10)
    print(f"    MBOSS products passing PILOT_FILTER: {len(mboss_in_pilot)}")
    for m in mboss_in_pilot:
        print(f"      {m['product_name_display']}")


async def main():
    print("=" * 70)
    print("PHASE 5C: FIX SHARED-SKU NAMING + VERIFICATION")
    print("=" * 70)
    
    await fix_doa_case()
    await fix_duplicate_humerus()
    await verify_final()
    
    print("\nDONE.")

asyncio.run(main())
