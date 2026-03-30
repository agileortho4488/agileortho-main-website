"""Phase 5C: Investigate shared-SKU pools across the catalog."""
import asyncio, os, re
from collections import defaultdict
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]
cp = db["catalog_products"]
cs = db["catalog_skus"]

async def investigate():
    # 1. Find products that share the same SKU codes
    print("=" * 70)
    print("PHASE 5C: SHARED-SKU POOL INVESTIGATION")
    print("=" * 70)
    
    # Build a map of sku_code → list of catalog_product_names
    print("\n=== Step 1: Finding SKUs assigned to multiple products ===")
    pipeline = [
        {"$group": {
            "_id": "$sku_code",
            "product_names": {"$addToSet": "$catalog_product_name"},
            "count": {"$sum": 1}
        }},
        {"$match": {"product_names.1": {"$exists": True}}},  # At least 2 products
        {"$sort": {"count": -1}}
    ]
    shared_skus = await cs.aggregate(pipeline).to_list(500)
    print(f"  SKU codes shared across multiple products: {len(shared_skus)}")
    
    # Group by product pair
    product_overlap = defaultdict(lambda: {"sku_count": 0, "sku_samples": []})
    for sku_doc in shared_skus:
        products = sorted(sku_doc["product_names"])
        key = tuple(products)
        product_overlap[key]["sku_count"] += 1
        if len(product_overlap[key]["sku_samples"]) < 3:
            product_overlap[key]["sku_samples"].append(sku_doc["_id"])
    
    print(f"  Unique product-group overlaps: {len(product_overlap)}")
    
    # 2. Show the worst offenders
    print("\n=== Step 2: Worst shared-SKU groups ===")
    sorted_overlaps = sorted(product_overlap.items(), key=lambda x: -x[1]["sku_count"])
    
    for products, info in sorted_overlaps[:15]:
        print(f"\n  SHARED POOL: {info['sku_count']} SKUs shared across {len(products)} products")
        print(f"  Sample SKUs: {info['sku_samples']}")
        for pname in products:
            # Get product info
            prod = await cp.find_one(
                {"product_name": pname},
                {"_id": 0, "product_name_display": 1, "division_canonical": 1, 
                 "category_canonical": 1, "brand": 1, "slug": 1, "mapping_confidence": 1}
            )
            if prod:
                print(f"    [{prod.get('division_canonical',''):15}] {prod.get('product_name_display',''):55} | cat: {prod.get('category_canonical','')} | conf: {prod.get('mapping_confidence','')}")
            else:
                print(f"    [NOT FOUND] {pname}")
    
    # 3. Specifically check DOA products
    print("\n\n=== Step 3: DOA (Drug of Abuse) Products ===")
    doa_products = await cp.find(
        {"product_name": re.compile("Drug of Abuse|DOA", re.I)},
        {"_id": 0, "product_name": 1, "product_name_display": 1, "slug": 1, "shadow_sku_count": 1}
    ).sort("product_name_display", 1).to_list(20)
    print(f"  DOA products: {len(doa_products)}")
    for p in doa_products:
        sku_count = await cs.count_documents({"catalog_product_name": p["product_name"]})
        print(f"    {p['product_name_display']:60} | {sku_count} SKUs | slug: {p['slug']}")
    
    # Check what SKUs the DOA products share
    if doa_products:
        first_doa = doa_products[0]["product_name"]
        doa_skus = await cs.find(
            {"catalog_product_name": first_doa},
            {"_id": 0, "sku_code": 1, "product_name": 1, "description": 1}
        ).to_list(10)
        print(f"\n  Sample SKUs for '{doa_products[0]['product_name_display']}':")
        for s in doa_skus[:5]:
            print(f"    {s.get('sku_code',''):20} | {s.get('product_name',''):40} | {s.get('description','')[:60]}")
    
    # 4. AutoQuant shared reagents
    print("\n\n=== Step 4: AutoQuant Reagent Sharing ===")
    aq_products = await cp.find(
        {"product_name": re.compile("AutoQuant.*Reagent", re.I), "division_canonical": "Diagnostics"},
        {"_id": 0, "product_name": 1, "product_name_display": 1, "shadow_sku_count": 1}
    ).sort("product_name_display", 1).to_list(100)
    
    # Check which share SKUs
    aq_sku_map = defaultdict(list)
    for p in aq_products:
        skus = await cs.find({"catalog_product_name": p["product_name"]}, {"_id": 0, "sku_code": 1}).to_list(200)
        sku_codes = set(s["sku_code"] for s in skus)
        for code in sku_codes:
            aq_sku_map[code].append(p["product_name"])
    
    shared_aq = {k: v for k, v in aq_sku_map.items() if len(v) > 1}
    if shared_aq:
        print(f"  AutoQuant SKUs shared across multiple products: {len(shared_aq)}")
        for sku, prods in list(shared_aq.items())[:5]:
            print(f"    SKU {sku} → {prods}")
    else:
        print(f"  No shared AutoQuant SKUs found (already clean)")
    
    # 5. Check Freedom Knee
    print("\n\n=== Step 5: Freedom Knee Products ===")
    freedom = await cp.find(
        {"product_name": re.compile("Freedom", re.I)},
        {"_id": 0, "product_name": 1, "product_name_display": 1, "shadow_sku_count": 1, "division_canonical": 1}
    ).to_list(10)
    for p in freedom:
        sku_count = await cs.count_documents({"catalog_product_name": p["product_name"]})
        print(f"  {p['product_name_display']:55} | {sku_count} SKUs | div: {p['division_canonical']}")
    
    # 6. Summary of all shared-SKU issues
    print("\n\n=== SUMMARY ===")
    total_shared_skus = sum(info["sku_count"] for _, info in product_overlap.items())
    print(f"  Total shared-SKU instances: {total_shared_skus}")
    print(f"  Unique shared-SKU groups: {len(product_overlap)}")
    print(f"  Largest group: {sorted_overlaps[0][1]['sku_count']} SKUs across {len(sorted_overlaps[0][0])} products")

asyncio.run(investigate())
