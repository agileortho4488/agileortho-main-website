"""Check DOA naming mismatch."""
import asyncio, os, re
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

async def check():
    cp = db["catalog_products"]
    cs = db["catalog_skus"]
    
    # Check canonical vs display names for DOA
    print("=== DOA Product Names ===")
    doa = await cp.find(
        {"product_name": re.compile("Drug of Abuse|DOA", re.I)},
        {"_id": 0, "product_name": 1, "product_name_display": 1}
    ).to_list(20)
    for d in doa:
        print(f"  canonical: {d['product_name']}")
        print(f"  display:   {d['product_name_display']}")
        print()
    
    # Check SKU catalog_product_name values
    print("\n=== DOA SKU catalog_product_name values ===")
    sku_names = await cs.distinct("catalog_product_name", {"catalog_product_name": re.compile("Drug of Abuse|DOA", re.I)})
    for s in sorted(sku_names):
        count = await cs.count_documents({"catalog_product_name": s})
        print(f"  [{count:3}] {s}")
    
    # Check MERISCREEN (upper) vs MeriScreen (mixed) mismatch
    print("\n=== Case mismatch check ===")
    upper = await cs.count_documents({"catalog_product_name": re.compile("^MERISCREEN", re.I)})
    print(f"  SKUs with MERISCREEN prefix: {upper}")

asyncio.run(check())
