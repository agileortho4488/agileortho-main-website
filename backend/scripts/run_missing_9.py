"""Run the 9 missing dry-run products."""
import asyncio, os, sys, json, time
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio
import httpx

sys.path.insert(0, "/app/backend")
from scripts.web_search_fallback import enrich_product, products_col, db

MISSING_SLUGS = [
    "2.7mm-3.5mm-lps-medial-distal-humerus-plates",
    "3.5mm-lps-proximal-humerus-plate,-short",
    "anti-rotation-screw",
    "midor-antiseptic-solution",
    "tracheal-t-tube",
    "tracheal-t-tube-8x80mm",
    "tracheal-t-tube-10x60mm",
    "baktio-blue-hand-sanitizer",
    "baktio-pink-hand-sanitizer",
]

async def main():
    products = []
    for slug in MISSING_SLUGS:
        p = await products_col.find_one({"slug": slug}, {"_id": 0})
        if p:
            products.append(p)
        else:
            print(f"[WARN] Slug not found: {slug}")

    print(f"Processing {len(products)} missing products...")
    async with httpx.AsyncClient() as http_client:
        for i, product in enumerate(products, 1):
            result = await enrich_product(product, http_client, i, len(products))
            status = result.get("status")
            slug = result.get("slug")
            if status == "success":
                e = result["enrichment"]
                print(f"  OK: conf={e.get('semantic_confidence')} status={e.get('web_verification_status')} action={e.get('recommended_action')}")
            else:
                print(f"  FAILED: {result.get('error')}")

    # Final count
    staged = await products_col.count_documents({"proposed_web_verification_status": {"$exists": True}})
    print(f"\nTotal staged after rerun: {staged}")

asyncio.run(main())
