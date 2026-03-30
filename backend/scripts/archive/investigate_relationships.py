"""Investigate existing family_relationships and semantic data for building Related Products."""
import asyncio, os
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

async def investigate():
    fr = db["family_relationships"]
    bsi = db["brand_system_intelligence"]
    cp = db["catalog_products"]
    
    # 1. All family_relationships
    print("=== FAMILY RELATIONSHIPS ===")
    rels = await fr.find({}, {"_id": 0}).to_list(100)
    for r in rels:
        src = r.get('source_entity','?') or '?'
        rel = r.get('relationship_type','?') or '?'
        tgt = r.get('target_entity','?') or '?'
        conf = r.get('confidence', 0) or 0
        ctx = r.get('clinical_context','') or ''
        print(f"  {src:15} --[{rel:25}]--> {tgt:15} | conf: {conf:.2f} | ctx: {ctx[:60]}")
    
    # 2. Brand system intelligence - check for related_entities
    print("\n=== BRAND SYSTEM INTELLIGENCE - related_entities ===")
    brands = await bsi.find({}, {"_id": 0, "entity_code": 1, "related_entities": 1, "system_type": 1}).to_list(50)
    for b in brands:
        related = b.get("related_entities", [])
        if related:
            print(f"  {b['entity_code']:15} ({b.get('system_type','')}) → related: {related}")
    
    # 3. Products with high semantic confidence
    print("\n=== PRODUCTS WITH HIGH SEMANTIC CONFIDENCE (>=0.9) ===")
    high_conf = await cp.count_documents({"semantic_confidence": {"$gte": 0.9}})
    total_enriched = await cp.count_documents({"semantic_brand_system": {"$exists": True, "$ne": None}})
    total = await cp.count_documents({})
    print(f"  High confidence (>=0.9): {high_conf}")
    print(f"  Total enriched: {total_enriched}")
    print(f"  Total products: {total}")
    
    # 4. Check what brands have multiple products (for same-family alternatives)
    print("\n=== BRANDS WITH MULTIPLE ENRICHED PRODUCTS ===")
    pipeline = [
        {"$match": {"semantic_brand_system": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": {"brand": "$semantic_brand_system", "division": "$division_canonical"}, "count": {"$sum": 1}, "products": {"$push": "$product_name_display"}}},
        {"$match": {"count": {"$gt": 1}}},
        {"$sort": {"count": -1}}
    ]
    groups = await cp.aggregate(pipeline).to_list(50)
    for g in groups:
        brand = g["_id"]["brand"]
        div = g["_id"]["division"]
        count = g["count"]
        prods = g["products"][:5]
        print(f"  {brand:15} [{div:20}] {count} products: {prods}")
    
    # 5. Check semantic_system_type distribution
    print("\n=== SYSTEM TYPE DISTRIBUTION ===")
    pipeline2 = [
        {"$match": {"semantic_system_type": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": "$semantic_system_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    types = await cp.aggregate(pipeline2).to_list(50)
    for t in types:
        print(f"  {t['_id']:25} {t['count']}")
    
    # 6. Check products with same category (for same-family alternatives)
    print("\n=== CATEGORY DISTRIBUTION (Trauma) ===")
    pipeline3 = [
        {"$match": {"division_canonical": "Trauma", "category_canonical": {"$exists": True, "$ne": ""}}},
        {"$group": {"_id": "$category_canonical", "count": {"$sum": 1}, "brands": {"$addToSet": "$semantic_brand_system"}}},
        {"$sort": {"count": -1}}
    ]
    cats = await cp.aggregate(pipeline3).to_list(50)
    for c in cats:
        brands_list = [b for b in c.get("brands", []) if b]
        print(f"  {c['_id']:30} {c['count']} products | brands: {brands_list}")

asyncio.run(investigate())
