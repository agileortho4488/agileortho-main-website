"""Phase 5B Report: Relationship graph analysis."""
import asyncio, os
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

async def report():
    cp = db["catalog_products"]
    
    # How many products have high-confidence semantic data
    high_conf = await cp.count_documents({"semantic_confidence": {"$gte": 0.85}})
    total = await cp.count_documents({})
    print(f"Products with high semantic confidence (>=0.85): {high_conf}/{total}")
    
    # For each enriched product, check if /related would return non-empty results
    # We check: does the product's brand have any relationships?
    fr = db["family_relationships"]
    all_sources = set()
    all_targets = set()
    rels = await fr.find({"status": "active", "confidence": {"$gte": 0.85}}, {"_id": 0}).to_list(100)
    for r in rels:
        src = r.get("source_entity_code", "")
        tgt = r.get("target_entity_code", "")
        tgt_type = r.get("target_entity_type", "")
        if tgt_type == "brand_system":
            all_sources.add(src)
            all_targets.add(tgt)
    
    connected_brands = all_sources | all_targets
    print(f"Brands with at least one relationship: {sorted(connected_brands)}")
    
    # Count products per connected brand
    products_with_related = 0
    brand_counts = {}
    for brand in connected_brands:
        count = await cp.count_documents({
            "semantic_brand_system": brand,
            "semantic_confidence": {"$gte": 0.85},
        })
        if count > 0:
            brand_counts[brand] = count
            products_with_related += count
    
    print(f"\nProducts that will show Related Products: {products_with_related}/{total}")
    print(f"\nBrand breakdown:")
    for brand, count in sorted(brand_counts.items(), key=lambda x: -x[1]):
        print(f"  {brand}: {count} products")
    
    # Products without any related products (low confidence or no brand)
    no_related = total - products_with_related
    print(f"\nProducts showing NO related items: {no_related}")

asyncio.run(report())
