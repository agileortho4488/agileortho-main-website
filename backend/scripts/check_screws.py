"""Check screw/bolt products that should be MBOSS enriched."""
import asyncio, os, re
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

async def check():
    cp = db["catalog_products"]
    
    # Find screw products
    print("=== Orthopedic Screws ===")
    screws = await cp.find(
        {"category_canonical": "Orthopedic Screws"},
        {"_id": 0, "product_name_display": 1, "brand": 1, "semantic_brand_system": 1, "slug": 1, "mapping_confidence": 1}
    ).to_list(20)
    for s in screws:
        print(f"  {s}")
    
    # Locking bolts
    print("\n=== Locking Bolts ===")
    bolts = await cp.find(
        {"category_canonical": "Locking Bolts"},
        {"_id": 0, "product_name_display": 1, "brand": 1, "semantic_brand_system": 1, "slug": 1}
    ).to_list(20)
    for b in bolts:
        print(f"  {b}")
    
    # Products with MBOSS in product_name
    print("\n=== Products with MBOSS in name ===")
    mboss_named = await cp.find(
        {"product_name": re.compile("MBOSS|Mboss", re.I)},
        {"_id": 0, "product_name": 1, "product_name_display": 1, "brand": 1, "semantic_brand_system": 1}
    ).to_list(20)
    for m in mboss_named:
        print(f"  {m}")
    
    # Check what brands screws have
    print("\n=== Screw/Bolt brand distribution ===")
    pipeline = [
        {"$match": {"category_canonical": {"$in": ["Orthopedic Screws", "Locking Bolts"]}}},
        {"$group": {"_id": "$brand", "count": {"$sum": 1}}}
    ]
    groups = await cp.aggregate(pipeline).to_list(20)
    for g in groups:
        print(f"  Brand: {g['_id'] or '(empty)'} → {g['count']} products")

asyncio.run(check())
