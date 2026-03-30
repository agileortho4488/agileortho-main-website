"""
Non-Pilot Shared-SKU Cleanup: Phase 2 — Remaining Pools
========================================================
Handles 5 remaining shared shadow_id pools after Phase 1:
  ENT:
    1. Nasal Splints (2 products, 6 SKUs) — merge duplicates
    2. MESIRE Sinus System (10 products, 190 SKUs) — split by SKU pattern
  Endo Surgery:
    3. Endocutter Reloads 60mm (5 products, 44 SKUs) — split by color/height
    4. Bladeless Trocar + Trocar Kit (6 products, 42 SKUs) — split by size
    5. MIRUS Endocutter 45/60mm (8 products, 64 SKUs) — split devices from reloads
"""
import asyncio, os, hashlib, re
from datetime import datetime, timezone
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]
products_col = db["catalog_products"]
skus_col = db["catalog_skus"]

NOW = datetime.now(timezone.utc).isoformat()


async def assign_unique_shadow(slug):
    """Give a product its own unique shadow_product_id."""
    p = await products_col.find_one({"slug": slug})
    if not p:
        print(f"    SKIP {slug}: not found")
        return None
    new_id = hashlib.sha256(f"split2_{slug}_{NOW}".encode()).hexdigest()[:16]
    await products_col.update_one(
        {"_id": p["_id"]},
        {"$set": {"shadow_product_id": new_id}},
    )
    return new_id


async def fix_nasal_splints():
    """ENT: Merge airway-nasal-splints into mynasal-internal-nasal-splints."""
    print("\n--- 1. ENT: Nasal Splints ---")
    keep = await products_col.find_one({"slug": "mynasal-internal-nasal-splints"})
    remove = await products_col.find_one({"slug": "airway-nasal-splints"})
    if not keep or not remove:
        print("  SKIP: one of the products not found")
        return

    keep_sid = keep.get("shadow_product_id", "")
    remove_sid = remove.get("shadow_product_id", "")

    # Reassign SKUs from remove to keep (they share the same pool so this is a no-op,
    # but we delete the duplicate product)
    if keep_sid == remove_sid:
        # Same pool — just delete the duplicate
        await products_col.delete_one({"_id": remove["_id"]})
        print(f"  Merged: airway-nasal-splints -> mynasal-internal-nasal-splints (same pool)")
    else:
        # Different pools — reassign
        result = await skus_col.update_many(
            {"product_id_shadow": remove_sid},
            {"$set": {"product_id_shadow": keep_sid}},
        )
        await products_col.delete_one({"_id": remove["_id"]})
        print(f"  Merged: reassigned {result.modified_count} SKUs, deleted duplicate")


async def fix_mesire_sinus():
    """ENT: Split MESIRE Sinus system (10 products sharing 190 SKUs)."""
    print("\n--- 2. ENT: MESIRE Sinus System ---")

    shared_sid = "5edf2de85948155d"

    # Map of product slugs to their SKU prefix patterns
    product_sku_map = {
        "mesire-sinus-balloon-catheter---5mm-x-17mm": lambda c: c.startswith("MSB5"),
        "mesire-sinus-balloon-catheter-6mm": lambda c: c.startswith("MSB6"),
        "mesire-sinus-balloon-catheter-7mm": lambda c: c.startswith("MSB7"),
        "mesire-guide-sinus-guide-catheter-0": lambda c: c == "MSG000",
        "mesire-guide-sinus-guide-catheter-30": lambda c: c == "MSG030",
        "mesire-guide-sinus-guide-catheter-70": lambda c: c == "MSG070",
        "mesire-guide-sinus-guide-catheter-90": lambda c: c == "MSG090",
        "mesire-guide-sinus-guide-catheter-110": lambda c: c == "MSG110",
        "mesire-illuminus-sinus-light-wire": lambda c: c.startswith("MSI") or c.startswith("MSGC"),
        # Parent (system/kit) gets the kit SKUs (MFSK, MMSK)
        "mesire-balloon-sinus-dilation-system": lambda c: c.startswith("MFSK") or c.startswith("MMSK"),
    }

    # Assign unique shadow_ids to all non-parent products
    slug_to_shadow = {}
    for slug in product_sku_map:
        if slug == "mesire-balloon-sinus-dilation-system":
            # Keep parent's shadow_id (or assign new one to clean up)
            new_sid = await assign_unique_shadow(slug)
            slug_to_shadow[slug] = new_sid
        else:
            new_sid = await assign_unique_shadow(slug)
            slug_to_shadow[slug] = new_sid

    # Now assign SKUs
    skus = await skus_col.find({"product_id_shadow": shared_sid}).to_list(300)
    assigned = 0
    unmatched = 0
    for sku in skus:
        code = sku.get("sku_code", "")
        matched = False
        for slug, pattern_fn in product_sku_map.items():
            if pattern_fn(code) and slug_to_shadow.get(slug):
                await skus_col.update_one(
                    {"_id": sku["_id"]},
                    {"$set": {"product_id_shadow": slug_to_shadow[slug]}},
                )
                assigned += 1
                matched = True
                break
        if not matched:
            unmatched += 1

    print(f"  Assigned {assigned} SKUs, {unmatched} unmatched (stay in old pool)")


async def fix_endocutter_reloads_60():
    """Endo Surgery: Split remaining reload products in f738dcb61dfb5c04."""
    print("\n--- 3. Endo Surgery: Endocutter 60mm Reloads ---")

    shared_sid = "f738dcb61dfb5c04"

    reload_map = {
        "power-endocutter-reload-60-25-white": lambda c: "6025" in c or (c.startswith("MECRW") and "60" in c),
        "power-endocutter-reload-60-35-blue": lambda c: "6035" in c or (c.startswith("MECRB") and "60" in c),
        "power-endocutter-reload-60-38-gold": lambda c: "6038" in c or (c.startswith("MECRGD") and "60" in c),
        "power-endocutter-reload-60-41-green": lambda c: "6041" in c or (c.startswith("MECRG-") and "60" in c),
        "power-endocutter-reload-60-44-black": lambda c: "6044" in c or (c.startswith("MECRT") and "60" in c),
    }

    slug_to_shadow = {}
    for slug in reload_map:
        new_sid = await assign_unique_shadow(slug)
        slug_to_shadow[slug] = new_sid

    skus = await skus_col.find({"product_id_shadow": shared_sid}).to_list(100)
    assigned = 0
    for sku in skus:
        code = sku.get("sku_code", "")
        for slug, pattern_fn in reload_map.items():
            if pattern_fn(code) and slug_to_shadow.get(slug):
                await skus_col.update_one(
                    {"_id": sku["_id"]},
                    {"$set": {"product_id_shadow": slug_to_shadow[slug]}},
                )
                assigned += 1
                break

    print(f"  Assigned {assigned} of {len(skus)} reload SKUs")


async def fix_trocar():
    """Endo Surgery: Split bladeless trocars from trocar kits."""
    print("\n--- 4. Endo Surgery: Bladeless Trocar + Trocar Kit ---")

    shared_sid = "1e64c5b956876980"

    # Bladeless trocars by size (ELR* codes)
    # Trocar kits are bundles — they share the same component SKUs
    # Give each product its own shadow_id
    all_slugs = [
        "bladeless-trocar-5mm",
        "bladeless-trocar-10mm",
        "bladeless-trocar-12mm",
        "trocar-kit-5mm",
        "trocar-kit-10mm",
        "trocar-kit-12mm",
    ]

    slug_to_shadow = {}
    for slug in all_slugs:
        new_sid = await assign_unique_shadow(slug)
        slug_to_shadow[slug] = new_sid

    # Map SKUs by code pattern
    sku_map = {
        "bladeless-trocar-5mm": lambda c: c in ("ELR05", "ELR0505"),
        "bladeless-trocar-10mm": lambda c: c in ("ELR10", "ELR1010"),
        "bladeless-trocar-12mm": lambda c: c in ("ELR12", "ELR1212"),
        # Knotless closure device goes with the 12mm trocar kit
        "trocar-kit-12mm": lambda c: c.startswith("MNKLS"),
    }

    skus = await skus_col.find({"product_id_shadow": shared_sid}).to_list(100)
    assigned = 0
    for sku in skus:
        code = sku.get("sku_code", "")
        for slug, pattern_fn in sku_map.items():
            if pattern_fn(code) and slug_to_shadow.get(slug):
                await skus_col.update_one(
                    {"_id": sku["_id"]},
                    {"$set": {"product_id_shadow": slug_to_shadow[slug]}},
                )
                assigned += 1
                break

    print(f"  Assigned {assigned} of {len(skus)} trocar SKUs")
    print(f"  Note: trocar-kit-5mm and trocar-kit-10mm have no unique SKUs (kit bundles)")


async def fix_mirus_endocutter_45_60():
    """Endo Surgery: Split MIRUS Endocutter 45/60mm devices from reloads."""
    print("\n--- 5. Endo Surgery: MIRUS Endocutter 45/60mm ---")

    shared_sid = "f626b1f588600724"

    product_sku_map = {
        # Devices by size code
        "mirus-endocutter---short": lambda c: c == "MEC065",
        "mirus-endocutter---medium": lambda c: c == "MEC160",
        "mirus-endocutter---long": lambda c: c == "MEC255",
        # Reloads by color + length
        "mirus-endocutter-reload-45mm-white": lambda c: c == "MECRW45",
        "mirus-endocutter-reload-45mm-purple": lambda c: c == "MECRP45",
        "mirus-endocutter-reload-60mm-white": lambda c: c == "MECRW60",
        "mirus-endocutter-reload-60mm-purple": lambda c: c == "MECRP60",
        "mirus-endocutter-reload-60mm-black": lambda c: c == "MECRB60",
    }

    slug_to_shadow = {}
    for slug in product_sku_map:
        new_sid = await assign_unique_shadow(slug)
        slug_to_shadow[slug] = new_sid

    skus = await skus_col.find({"product_id_shadow": shared_sid}).to_list(100)
    assigned = 0
    for sku in skus:
        code = sku.get("sku_code", "")
        for slug, pattern_fn in product_sku_map.items():
            if pattern_fn(code) and slug_to_shadow.get(slug):
                await skus_col.update_one(
                    {"_id": sku["_id"]},
                    {"$set": {"product_id_shadow": slug_to_shadow[slug]}},
                )
                assigned += 1
                break

    print(f"  Assigned {assigned} of {len(skus)} endocutter 45/60 SKUs")


async def main():
    print("=" * 60)
    print("NON-PILOT SHARED-SKU CLEANUP — PHASE 2")
    print("=" * 60)

    await fix_nasal_splints()
    await fix_mesire_sinus()
    await fix_endocutter_reloads_60()
    await fix_trocar()
    await fix_mirus_endocutter_45_60()

    # Final counts
    print("\n=== FINAL STATE ===")
    for div in ["ENT", "Endo Surgery"]:
        total = await products_col.count_documents({"division_canonical": div})
        products = await products_col.find(
            {"division_canonical": div},
            {"_id": 0, "shadow_product_id": 1}
        ).to_list(500)
        seen = {}
        for p in products:
            sid = p.get("shadow_product_id", "")
            if sid:
                seen[sid] = seen.get(sid, 0) + 1
        shared = sum(1 for v in seen.values() if v > 1)
        print(f"  {div}: {total} products, {shared} remaining shared shadow_ids")

    print("\nDone!")


asyncio.run(main())
