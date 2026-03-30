"""Check why some products have empty related results."""
import asyncio, os
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

async def check():
    cp = db["catalog_products"]
    fr = db["family_relationships"]
    
    # MBOSS products
    print("=== MBOSS products ===")
    mboss = await cp.find(
        {"semantic_brand_system": "MBOSS"},
        {"_id": 0, "product_name_display": 1, "semantic_confidence": 1, "mapping_confidence": 1, "review_required": 1, "status": 1}
    ).to_list(10)
    for m in mboss:
        print(f"  {m}")
    
    # CLAVO relationships
    print("\n=== CLAVO forward relationships ===")
    clavo_rels = await fr.find({"source_entity_code": "CLAVO"}, {"_id": 0}).to_list(10)
    for r in clavo_rels:
        print(f"  → {r.get('target_entity_code')} ({r.get('relationship_type')}) conf={r.get('confidence')}")
    
    # CLAVO products  
    print("\n=== CLAVO products (high conf, verified) ===")
    clavo_prods = await cp.find(
        {"semantic_brand_system": "CLAVO", "mapping_confidence": "high", "review_required": False, "status": {"$ne": "draft"}},
        {"_id": 0, "product_name_display": 1, "slug": 1, "semantic_confidence": 1, "category_canonical": 1}
    ).to_list(20)
    for p in clavo_prods:
        print(f"  {p}")
    
    # BIOMIME relationships
    print("\n=== All relationship types ===")
    all_types = await fr.distinct("relationship_type")
    print(f"  Types: {all_types}")
    
    # Check BIOMIME entity codes
    print("\n=== Brand system codes containing BIO ===")
    brands = await db["brand_system_intelligence"].find(
        {"entity_code": {"$regex": "BIO", "$options": "i"}},
        {"_id": 0, "entity_code": 1, "related_entities": 1}
    ).to_list(10)
    for b in brands:
        print(f"  {b}")
    
    # MOZEC products
    print("\n=== MOZEC products ===")
    mozec = await cp.find(
        {"semantic_brand_system": "MOZEC"},
        {"_id": 0, "product_name_display": 1, "semantic_confidence": 1, "mapping_confidence": 1}
    ).to_list(10)
    for m in mozec:
        print(f"  {m}")

asyncio.run(check())
