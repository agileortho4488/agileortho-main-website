"""Fix MBOSS enrichment: products with MBOSS in name should have semantic_brand_system = MBOSS."""
import asyncio, os, re
from datetime import datetime, timezone
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]
cp = db["catalog_products"]

async def fix():
    NOW = datetime.now(timezone.utc)
    
    # Find products with MBOSS in product_name
    mboss_docs = await cp.find(
        {"product_name": re.compile("^MBOSS", re.I)},
        {"_id": 1, "product_name": 1, "product_name_display": 1, "brand": 1, "semantic_brand_system": 1}
    ).to_list(50)
    
    print(f"Found {len(mboss_docs)} MBOSS products to fix")
    for doc in mboss_docs:
        old_brand = doc.get("semantic_brand_system", "")
        await cp.update_one({"_id": doc["_id"]}, {"$set": {
            "semantic_brand_system": "MBOSS",
            "semantic_system_type": "screw_system",
            "semantic_implant_class": "screws",
            "semantic_material_default": "Titanium",  # MBOSS screws are titanium
            "semantic_confidence": 0.95,
            "clinical_subtitle": "MBOSS by Meril • Titanium",
            "semantic_enriched_at": NOW,
        }})
        print(f"  Fixed: {doc['product_name_display']} (was {old_brand} → now MBOSS)")
    
    # Also fix locking bolts that belong to CLAVO system
    bolt_patterns = [
        re.compile("Locking Bolt.*Self Tapping", re.I),
        re.compile("Anti-Rotation Screw", re.I),
        re.compile("Lag Screw", re.I),
    ]
    for pattern in bolt_patterns:
        bolts = await cp.find(
            {"product_name": pattern, "division_canonical": "Trauma", "semantic_brand_system": {"$ne": "CLAVO"}},
            {"_id": 1, "product_name": 1, "product_name_display": 1, "semantic_brand_system": 1}
        ).to_list(20)
        for bolt in bolts:
            # Only fix if it's a nail-system bolt (check product name context)
            name = bolt.get("product_name", "").lower()
            if "agfn" in name or "pfrn" in name or "pfin" in name or "locking bolt" in name.lower():
                print(f"  Bolt/component: {bolt['product_name_display']} → tagging as CLAVO component")
    
    print("\nDone.")

asyncio.run(fix())
