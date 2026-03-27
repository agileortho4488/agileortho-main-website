"""
P0 Fix: Rename mis-grouped product pages and flag duplicates.
Phase 1 of the systematic grouping audit.

Actions:
1. Rename narrowly-titled humerus pages to broader family names
2. Hide the duplicate humerus page (same 83 SKUs as the renamed one)
3. Flag known shared-SKU products for future split
"""
import asyncio
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]

catalog_products = db["catalog_products"]


async def rename_humerus_pages():
    """Fix the two humerus pages that share identical 83 SKUs."""
    
    # Page 1: Rename from narrow "Medial Distal" to broader family name
    slug1 = "2.7mm-3.5mm-lps-medial-distal-humerus-plates"
    result1 = await catalog_products.update_one(
        {"slug": slug1},
        {"$set": {
            "product_name_display": "2.7mm-3.5mm LPS Humerus Bone Plates (Titanium)",
            "description_live": "LPS Humerus Internal Fixation Plate Family. Includes Proximal, Periarticular Proximal Lateral, Medial Distal, and Posterior Distal Humerus Plates. 2.7mm and 3.5mm. Titanium alloy.",
            "category": "Humerus Plates",
            "grouping_audit": {
                "status": "renamed",
                "original_display_name": "2.7mm-3.5mm LPS Medial Distal Humerus Plates",
                "reason": "Heading was too narrow for the 83 SKU set spanning multiple humerus subgroups",
                "action": "Renamed to broader family name",
                "audit_date": datetime.now(timezone.utc).isoformat(),
                "needs_future_split": True,
            },
        }}
    )
    print(f"Renamed humerus page 1: modified={result1.modified_count}")

    # Page 2: Hide the duplicate (shares exact same 83 SKUs)
    slug2 = "3.5mm-lps-proximal-humerus-plate,-short"
    result2 = await catalog_products.update_one(
        {"slug": slug2},
        {"$set": {
            "review_required": True,
            "grouping_audit": {
                "status": "hidden_duplicate",
                "reason": "Shares identical 83 SKU set with slug=" + slug1,
                "action": "Hidden from pilot — review_required=True",
                "audit_date": datetime.now(timezone.utc).isoformat(),
                "duplicate_of": slug1,
            },
        }}
    )
    print(f"Hidden duplicate humerus page 2: modified={result2.modified_count}")


async def flag_shared_sku_products():
    """Flag Diagnostics products that share SKU pools but don't hide them."""
    
    # DOA products: 7 products sharing same 80 SKUs
    doa_slugs = await catalog_products.distinct("slug", {"slug": {"$regex": "meriscreen-drug-of-abuse"}})
    for slug in doa_slugs:
        await catalog_products.update_one(
            {"slug": slug},
            {"$set": {
                "grouping_audit": {
                    "status": "flagged_shared_skus",
                    "reason": "Multiple DOA products share the same 80-SKU brochure pool",
                    "action": "Flagged for future split — each product should only show its own test type SKUs",
                    "audit_date": datetime.now(timezone.utc).isoformat(),
                    "sku_pool_group": "meriscreen_doa",
                },
            }}
        )
    print(f"Flagged {len(doa_slugs)} DOA products for future split")

    # Reagent products: shared 50-SKU pools
    reagent_slugs = ["micro-albumin-reagent", "crp-reagent", "lipase-reagent"]
    for slug in reagent_slugs:
        await catalog_products.update_one(
            {"slug": slug},
            {"$set": {
                "grouping_audit": {
                    "status": "flagged_shared_skus",
                    "reason": "Reagent products share a broad 50-SKU brochure pool",
                    "action": "Flagged for future split — each reagent should show only its own SKUs",
                    "audit_date": datetime.now(timezone.utc).isoformat(),
                    "sku_pool_group": "autoquant_reagents",
                },
            }}
        )
    print(f"Flagged {len(reagent_slugs)} reagent products for future split")


async def generate_audit_report():
    """Generate a summary of all large-variant products and their grouping status."""
    
    # All products with 15+ SKUs in pilot divisions
    pipeline = [
        {"$match": {
            "division_canonical": {"$in": ["Trauma", "Cardiovascular", "Diagnostics", "Joint Replacement"]},
            "mapping_confidence": "high",
            "shadow_sku_count": {"$gte": 15}
        }},
        {"$project": {
            "_id": 0, "slug": 1, "product_name_display": 1, "division_canonical": 1,
            "shadow_sku_count": 1, "category": 1, "grouping_audit": 1, "review_required": 1
        }},
        {"$sort": {"shadow_sku_count": -1}}
    ]
    
    products = await catalog_products.aggregate(pipeline).to_list(100)
    
    print("\n" + "=" * 80)
    print("GROUPING AUDIT REPORT — PILOT DIVISIONS")
    print("=" * 80)
    
    for p in products:
        audit = p.get("grouping_audit", {})
        status = audit.get("status", "not_audited")
        hidden = p.get("review_required", False)
        marker = " [HIDDEN]" if hidden else ""
        print(f"  {p['shadow_sku_count']:>4} SKUs  {status:<25}  {p['product_name_display'][:50]}{marker}  [{p['division_canonical']}]")
    
    print(f"\nTotal large-variant products in pilot: {len(products)}")


async def main():
    print("=" * 60)
    print("P0 FIX: PRODUCT GROUPING AUDIT & RENAME")
    print("=" * 60)
    
    await rename_humerus_pages()
    await flag_shared_sku_products()
    await generate_audit_report()
    
    print("\nDONE.")

asyncio.run(main())
