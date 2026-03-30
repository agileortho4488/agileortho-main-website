"""
Phase 2: Catalog Merge — catalog_products + catalog_skus
Creates merged catalog collections from live + shadow data.

Match order (strict):
  1. Exact SKU/code link
  2. Exact normalized product family + brand + division
  3. Exact slug/product name match
  4. Fuzzy token match (only if above fail)

Rules:
  - Live owns: slug, images, pricing, stock/status, SEO fields
  - Shadow enriches: brand, brochure description, specs, source files, SKU structure
  - Ambiguous matches: enriched_from_shadow=false, review_required=true
  - Shadow-only products: status=draft, live_visible=false
  - Every record stores: source_of_truth_fields, enriched_from_shadow, mapping_confidence, review_required, match_method, match_score
"""
import asyncio
import os
import re
from datetime import datetime, timezone
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME")]


def normalize_text(text):
    """Normalize text for comparison: lowercase, strip, collapse whitespace."""
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.lower().strip())


def tokenize(text):
    """Split into comparable tokens."""
    if not text:
        return set()
    return set(re.findall(r'[a-z0-9]+', text.lower()))


def token_similarity(a, b):
    """Jaccard similarity between token sets."""
    ta, tb = tokenize(a), tokenize(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def normalize_display_name(name):
    """Convert ALL CAPS to Title Case, preserve mixed case."""
    if not name:
        return name
    letters = [c for c in name if c.isalpha()]
    if not letters:
        return name
    upper_ratio = sum(1 for c in letters if c.isupper()) / len(letters)
    if upper_ratio > 0.6 and len(name) > 5:
        acronyms = {"UHMWPE", "PEEK", "TAN", "SS", "CoCr", "CP", "ELI", "PTCA",
                     "TAVR", "AGFN", "IMCF", "PFIN", "PFRN", "PPH", "PCL", "PGA",
                     "PGCL", "IFU", "CE", "USFDA", "RF", "ENT", "HIV", "HCV", "HBV",
                     "PP", "3D", "CM", "MM"}
        words = name.split()
        result = []
        for w in words:
            w_upper = w.upper().rstrip(".,;:()")
            if w_upper in acronyms:
                result.append(w.upper())
            elif re.match(r'^\d', w):
                result.append(w)
            elif re.match(r'^[A-Z]{2,5}\d', w):
                result.append(w)
            elif re.match(r'^\(.*\)$', w):
                result.append(w.lower())
            else:
                result.append(w.capitalize())
        return " ".join(result)
    return name


async def load_division_map():
    """Load Phase 1 division canonical map."""
    mapping = {}
    cursor = db.catalog_division_map.find({}, {"_id": 0})
    async for doc in cursor:
        live = doc.get("division_live_original")
        if live:
            mapping[live] = doc["division_canonical"]
        for s in doc.get("division_shadow_originals", []):
            mapping[s] = doc["division_canonical"]
    return mapping


async def load_material_map():
    """Load Phase 1 material normalization dictionary."""
    mapping = {}
    cursor = db.catalog_material_dict.find({}, {"_id": 0})
    async for doc in cursor:
        mapping[doc["material_original"]] = doc["material_canonical"]
    return mapping


async def load_all_data():
    """Load all live products, shadow products, and shadow SKUs."""
    live_products = []
    cursor = db.products.find({}, {"_id": 0})
    async for doc in cursor:
        live_products.append(doc)

    shadow_products = []
    cursor = db.shadow_products.find({}, {"_id": 0})
    async for doc in cursor:
        shadow_products.append(doc)

    shadow_skus = []
    cursor = db.shadow_skus.find({}, {"_id": 0})
    async for doc in cursor:
        shadow_skus.append(doc)

    return live_products, shadow_products, shadow_skus


def build_shadow_indexes(shadow_products, shadow_skus):
    """Build lookup indexes for shadow data."""
    # Index shadow products by normalized name
    by_name = {}
    for sp in shadow_products:
        key = normalize_text(sp.get("name", ""))
        if key:
            by_name[key] = sp

    # Index shadow products by product_id
    by_id = {sp["product_id"]: sp for sp in shadow_products if sp.get("product_id")}

    # Index shadow SKUs by product_id
    skus_by_product = defaultdict(list)
    for sku in shadow_skus:
        pid = sku.get("product_id")
        if pid:
            skus_by_product[pid].append(sku)

    # Index shadow SKUs by sku_code (for exact SKU matching)
    skus_by_code = defaultdict(list)
    for sku in shadow_skus:
        code = sku.get("sku_code", "").strip().upper()
        if code:
            skus_by_code[code].append(sku)

    # Index shadow products by brand+division combo
    by_brand_div = defaultdict(list)
    for sp in shadow_products:
        brand = normalize_text(sp.get("brand", ""))
        div = normalize_text(sp.get("division", ""))
        if brand and div:
            by_brand_div[(brand, div)].append(sp)

    return by_name, by_id, skus_by_product, skus_by_code, by_brand_div


def match_live_to_shadow(live_prod, shadow_indexes, div_map):
    """
    Try to match a live product to a shadow product.
    Returns (shadow_product, match_method, match_score) or (None, "none", 0).
    """
    by_name, by_id, skus_by_product, skus_by_code, by_brand_div = shadow_indexes

    live_sku = (live_prod.get("sku_code") or "").strip().upper()
    live_name = live_prod.get("product_name", "")
    live_name_norm = normalize_text(live_name)
    live_family = normalize_text(live_prod.get("product_family", ""))
    live_div = live_prod.get("division", "")
    live_div_canonical = normalize_text(div_map.get(live_div, live_div))

    # ── TIER 1: Exact SKU/code link ──
    if live_sku:
        sku_matches = skus_by_code.get(live_sku, [])
        if sku_matches:
            pid = sku_matches[0].get("product_id")
            if pid and pid in by_id:
                return by_id[pid], "exact_sku_link", 1.0

    # ── TIER 2: Exact normalized product family + brand + division ──
    if live_family:
        for (brand_key, div_key), sps in by_brand_div.items():
            if div_key == live_div_canonical or div_key in live_div_canonical:
                for sp in sps:
                    sp_name_norm = normalize_text(sp.get("name", ""))
                    # Check if shadow brand appears in live family name
                    if brand_key and brand_key in live_family and sp_name_norm:
                        # Check name similarity within same brand+division
                        sim = token_similarity(live_family, sp_name_norm)
                        if sim >= 0.5:
                            return sp, "family_brand_division", round(sim, 3)

    # ── TIER 3: Exact slug/product name match ──
    if live_name_norm in by_name:
        return by_name[live_name_norm], "exact_name_match", 1.0

    # Also try with common transformations
    # Remove size/dimension suffixes for matching
    clean_name = re.sub(r'\s*\([\d.]+\s*(cm|mm|x).*?\)\s*$', '', live_name_norm, flags=re.IGNORECASE).strip()
    if clean_name and clean_name in by_name:
        return by_name[clean_name], "exact_name_cleaned", 0.95

    # ── TIER 4: Fuzzy token match ──
    best_match = None
    best_score = 0.0
    for sp in by_name.values():
        sp_name = normalize_text(sp.get("name", ""))
        sp_div = normalize_text(div_map.get(sp.get("division", ""), sp.get("division", "")))

        # Only fuzzy match within same canonical division
        if sp_div != live_div_canonical:
            continue

        sim = token_similarity(live_name_norm, sp_name)
        if sim > best_score and sim >= 0.4:
            best_score = sim
            best_match = sp

    if best_match and best_score >= 0.4:
        return best_match, "fuzzy_token", round(best_score, 3)

    return None, "none", 0.0


def build_catalog_product(live_prod, shadow_match, match_method, match_score,
                          div_map, mat_map, shadow_skus_for_product):
    """Build a catalog_products record."""
    now = datetime.now(timezone.utc).isoformat()

    live_div = live_prod.get("division", "")
    canonical_div = div_map.get(live_div, live_div)
    canonical_mat = mat_map.get(live_prod.get("material", ""), live_prod.get("material", ""))

    # Determine confidence and enrichment status
    if match_method in ("exact_sku_link", "exact_name_match") and match_score >= 0.95:
        mapping_confidence = "high"
        enriched = True
        review_required = False
    elif match_method in ("family_brand_division", "exact_name_cleaned") and match_score >= 0.7:
        mapping_confidence = "high"
        enriched = True
        review_required = False
    elif match_method in ("family_brand_division",) and match_score >= 0.5:
        # Mid-range structural match: flag for review, do not auto-enrich
        mapping_confidence = "medium"
        enriched = False
        review_required = True
    elif match_method == "fuzzy_token" and match_score >= 0.6:
        mapping_confidence = "medium"
        enriched = True
        review_required = True  # Rule 2: ambiguous = review
    elif match_method == "fuzzy_token":
        mapping_confidence = "low"
        enriched = False  # Rule 2: not auto-enriched
        review_required = True
    elif match_method == "none":
        mapping_confidence = "live_only"
        enriched = False
        review_required = False
    else:
        mapping_confidence = "low"
        enriched = False
        review_required = True

    # ── Live-owned fields (authoritative) ──
    record = {
        # Identity
        "product_name": live_prod.get("product_name", ""),
        "product_name_display": normalize_display_name(live_prod.get("product_name", "")),
        "sku_code": live_prod.get("sku_code", ""),
        "product_family": live_prod.get("product_family", ""),
        "product_family_display": normalize_display_name(live_prod.get("product_family", "")),

        # Live commerce fields (authoritative per Rule 4)
        "slug": live_prod.get("slug", ""),
        "images": live_prod.get("images", []),
        "status": live_prod.get("status", "published"),
        "live_visible": True,
        "brochure_url": live_prod.get("brochure_url", ""),
        "seo_meta_title": live_prod.get("seo_meta_title", ""),
        "seo_meta_description": live_prod.get("seo_meta_description", ""),
        "pack_size": live_prod.get("pack_size"),
        "size_variables": live_prod.get("size_variables"),
        "created_at": live_prod.get("created_at", now),
        "updated_at": live_prod.get("updated_at", now),

        # Canonical taxonomy (from Phase 1)
        "division_canonical": canonical_div,
        "division_live_original": live_div,
        "category": live_prod.get("category", ""),
        "material_canonical": canonical_mat,
        "material_live_original": live_prod.get("material", ""),
        "manufacturer": live_prod.get("manufacturer", ""),

        # Live description (kept as base)
        "description_live": live_prod.get("description", ""),
        "technical_specifications": live_prod.get("technical_specifications", {}),
    }

    # ── Shadow enrichment (only if high confidence) ──
    if enriched and shadow_match:
        record["brand"] = shadow_match.get("brand", "")
        record["parent_brand"] = shadow_match.get("parent_brand", "")
        record["description_shadow"] = shadow_match.get("description", "")
        record["division_shadow_original"] = shadow_match.get("division", "")
        record["shadow_product_id"] = shadow_match.get("product_id", "")
        record["shadow_source_files"] = shadow_match.get("source_files", [])
        record["shadow_source_pages"] = shadow_match.get("source_pages", [])
        record["shadow_sku_count"] = len(shadow_skus_for_product)
    else:
        record["brand"] = ""
        record["parent_brand"] = ""
        record["description_shadow"] = ""
        record["division_shadow_original"] = ""
        record["shadow_product_id"] = ""
        record["shadow_source_files"] = []
        record["shadow_source_pages"] = []
        record["shadow_sku_count"] = 0

    # ── Traceability fields ──
    record["source_of_truth_fields"] = {
        "slug": "live",
        "images": "live",
        "status": "live",
        "seo_meta_title": "live",
        "seo_meta_description": "live",
        "brochure_url": "live",
        "pack_size": "live",
        "size_variables": "live",
        "description_live": "live",
        "technical_specifications": "live",
        "brand": "shadow" if enriched else "none",
        "parent_brand": "shadow" if enriched else "none",
        "description_shadow": "shadow" if enriched else "none",
        "shadow_source_files": "shadow" if enriched else "none",
    }
    record["enriched_from_shadow"] = enriched
    record["mapping_confidence"] = mapping_confidence
    record["review_required"] = review_required
    record["match_method"] = match_method
    record["match_score"] = match_score
    record["catalog_created_at"] = now

    return record


def build_shadow_only_product(shadow_prod, div_map, shadow_skus_for_product):
    """Build a catalog_products record for shadow-only products (Rule 3)."""
    now = datetime.now(timezone.utc).isoformat()
    shadow_div = shadow_prod.get("division", "")
    canonical_div = div_map.get(shadow_div, shadow_div)

    return {
        "product_name": shadow_prod.get("name", ""),
        "product_name_display": normalize_display_name(shadow_prod.get("name", "")),
        "sku_code": "",
        "product_family": shadow_prod.get("name", ""),
        "product_family_display": normalize_display_name(shadow_prod.get("name", "")),

        # Shadow-only: draft, not live visible (Rule 3)
        "slug": "",
        "images": [],
        "status": "draft",
        "live_visible": False,
        "brochure_url": "",
        "seo_meta_title": "",
        "seo_meta_description": "",
        "pack_size": None,
        "size_variables": None,
        "created_at": now,
        "updated_at": now,

        # Taxonomy
        "division_canonical": canonical_div,
        "division_live_original": "",
        "division_shadow_original": shadow_div,
        "category": shadow_prod.get("sub_category", ""),
        "material_canonical": "",
        "material_live_original": "",
        "manufacturer": "",

        # Descriptions
        "description_live": "",
        "description_shadow": shadow_prod.get("description", ""),
        "technical_specifications": {},

        # Shadow enrichment
        "brand": shadow_prod.get("brand", ""),
        "parent_brand": shadow_prod.get("parent_brand", ""),
        "shadow_product_id": shadow_prod.get("product_id", ""),
        "shadow_source_files": shadow_prod.get("source_files", []),
        "shadow_source_pages": shadow_prod.get("source_pages", []),
        "shadow_sku_count": len(shadow_skus_for_product),

        # Traceability
        "source_of_truth_fields": {
            "slug": "none",
            "images": "none",
            "status": "shadow_draft",
            "brand": "shadow",
            "parent_brand": "shadow",
            "description_shadow": "shadow",
            "shadow_source_files": "shadow",
        },
        "enriched_from_shadow": True,
        "mapping_confidence": "shadow_only",
        "review_required": True,
        "match_method": "shadow_only",
        "match_score": 0,
        "catalog_created_at": now,
    }


def build_catalog_sku(sku_data, catalog_product_name, source):
    """Build a catalog_skus record."""
    return {
        "sku_code": sku_data.get("sku_code", ""),
        "catalog_product_name": catalog_product_name,
        "product_id_shadow": sku_data.get("product_id", ""),
        "product_name": sku_data.get("product_name", catalog_product_name),
        "brand": sku_data.get("brand", ""),
        "division": sku_data.get("division", ""),
        "sub_category": sku_data.get("sub_category", ""),
        "description": sku_data.get("description", ""),
        "source_file": sku_data.get("source_file", ""),
        "source": source,  # "shadow" or "live_variant"
        "catalog_created_at": datetime.now(timezone.utc).isoformat(),
    }


async def run_merge():
    print("=" * 60)
    print("PHASE 2: CATALOG MERGE")
    print("=" * 60)
    print()

    # Load Phase 1 maps
    div_map = await load_division_map()
    mat_map = await load_material_map()
    print(f"Loaded Phase 1 maps: {len(div_map)} divisions, {len(mat_map)} materials")

    # Load all data
    live_products, shadow_products, shadow_skus = await load_all_data()
    print(f"Loaded: {len(live_products)} live, {len(shadow_products)} shadow, {len(shadow_skus)} shadow SKUs")

    # Build shadow indexes
    shadow_indexes = build_shadow_indexes(shadow_products, shadow_skus)
    _, by_id, skus_by_product, _, _ = shadow_indexes

    # ── STEP 1: Match live products to shadow ──
    print("\nMatching live products to shadow...")
    catalog_products = []
    catalog_skus = []
    matched_shadow_ids = set()

    report = {
        "high_confidence": 0,
        "medium_confidence": 0,
        "low_confidence": 0,
        "live_only": 0,
        "shadow_only_draft": 0,
        "skus_from_shadow": 0,
        "skus_from_live_variants": 0,
        "flagged_for_review": 0,
        "match_methods": defaultdict(int),
    }

    for lp in live_products:
        shadow_match, method, score = match_live_to_shadow(lp, shadow_indexes, div_map)

        # Get shadow SKUs for the matched product
        shadow_skus_for_prod = []
        if shadow_match and shadow_match.get("product_id"):
            shadow_skus_for_prod = skus_by_product.get(shadow_match["product_id"], [])
            matched_shadow_ids.add(shadow_match["product_id"])

        # Build catalog product
        cp = build_catalog_product(lp, shadow_match, method, score, div_map, mat_map, shadow_skus_for_prod)
        catalog_products.append(cp)

        # Track report
        conf = cp["mapping_confidence"]
        if conf == "high":
            report["high_confidence"] += 1
        elif conf == "medium":
            report["medium_confidence"] += 1
        elif conf == "low":
            report["low_confidence"] += 1
        else:
            report["live_only"] += 1
        if cp["review_required"]:
            report["flagged_for_review"] += 1
        report["match_methods"][method] += 1

        # Build catalog SKUs from shadow
        if cp["enriched_from_shadow"] and shadow_skus_for_prod:
            for sku in shadow_skus_for_prod:
                cs = build_catalog_sku(sku, lp.get("product_name", ""), "shadow")
                catalog_skus.append(cs)
                report["skus_from_shadow"] += 1

        # Build catalog SKUs from live size_variables (if present and no shadow SKUs)
        if not shadow_skus_for_prod and lp.get("size_variables"):
            svars = lp["size_variables"]
            if isinstance(svars, list):
                for sv in svars:
                    if isinstance(sv, dict):
                        sku_entry = {
                            "sku_code": sv.get("sku_code", sv.get("code", "")),
                            "product_name": lp.get("product_name", ""),
                            "brand": "",
                            "division": lp.get("division", ""),
                            "sub_category": lp.get("category", ""),
                            "description": str(sv.get("size", sv.get("description", ""))),
                        }
                        cs = build_catalog_sku(sku_entry, lp.get("product_name", ""), "live_variant")
                        catalog_skus.append(cs)
                        report["skus_from_live_variants"] += 1

    # ── STEP 2: Add shadow-only products as drafts ──
    print("Adding shadow-only products as drafts...")
    for sp in shadow_products:
        pid = sp.get("product_id")
        if pid and pid not in matched_shadow_ids:
            shadow_skus_for_prod = skus_by_product.get(pid, [])
            cp = build_shadow_only_product(sp, div_map, shadow_skus_for_prod)
            catalog_products.append(cp)
            report["shadow_only_draft"] += 1
            report["flagged_for_review"] += 1

            # Add SKUs for shadow-only products
            for sku in shadow_skus_for_prod:
                cs = build_catalog_sku(sku, sp.get("name", ""), "shadow")
                catalog_skus.append(cs)
                report["skus_from_shadow"] += 1

    # ── STEP 3: Write to MongoDB ──
    print(f"\nWriting {len(catalog_products)} catalog products...")
    await db.catalog_products.drop()
    if catalog_products:
        await db.catalog_products.insert_many(catalog_products)

    print(f"Writing {len(catalog_skus)} catalog SKUs...")
    await db.catalog_skus.drop()
    if catalog_skus:
        await db.catalog_skus.insert_many(catalog_skus)

    # Create indexes
    await db.catalog_products.create_index("slug")
    await db.catalog_products.create_index("division_canonical")
    await db.catalog_products.create_index("category")
    await db.catalog_products.create_index("brand")
    await db.catalog_products.create_index("status")
    await db.catalog_products.create_index("mapping_confidence")
    await db.catalog_products.create_index("review_required")
    await db.catalog_products.create_index("enriched_from_shadow")
    await db.catalog_skus.create_index("sku_code")
    await db.catalog_skus.create_index("catalog_product_name")
    await db.catalog_skus.create_index("brand")

    # ── STEP 4: Generate merge report ──
    report["total_catalog_products"] = len(catalog_products)
    report["total_catalog_skus"] = len(catalog_skus)
    report["match_methods"] = dict(report["match_methods"])

    # Store report
    report["phase"] = "Phase 2 - Catalog Merge"
    report["generated_at"] = datetime.now(timezone.utc).isoformat()
    await db.catalog_merge_report.drop()
    await db.catalog_merge_report.insert_one(report)

    # Print report
    print()
    print("=" * 60)
    print("PHASE 2 MERGE REPORT")
    print("=" * 60)
    print(f"Total catalog products:     {report['total_catalog_products']}")
    print(f"Total catalog SKUs:         {report['total_catalog_skus']}")
    print()
    print(f"High-confidence matches:    {report['high_confidence']}")
    print(f"Medium-confidence matches:  {report['medium_confidence']}")
    print(f"Low-confidence matches:     {report['low_confidence']}")
    print(f"Live-only products:         {report['live_only']}")
    print(f"Shadow-only draft products: {report['shadow_only_draft']}")
    print()
    print(f"SKUs from shadow:           {report['skus_from_shadow']}")
    print(f"SKUs from live variants:    {report['skus_from_live_variants']}")
    print()
    print(f"Flagged for review:         {report['flagged_for_review']}")
    print()
    print("Match methods:")
    for method, count in sorted(report["match_methods"].items(), key=lambda x: -x[1]):
        print(f"  {method}: {count}")

    # Trauma subset preview
    print()
    print("=" * 60)
    print("TRAUMA DIVISION PREVIEW")
    print("=" * 60)
    trauma_total = await db.catalog_products.count_documents({"division_canonical": "Trauma"})
    trauma_enriched = await db.catalog_products.count_documents({"division_canonical": "Trauma", "enriched_from_shadow": True})
    trauma_review = await db.catalog_products.count_documents({"division_canonical": "Trauma", "review_required": True})
    trauma_skus = await db.catalog_skus.count_documents({"division": {"$regex": "trauma", "$options": "i"}})
    print(f"Trauma products:            {trauma_total}")
    print(f"Trauma enriched from shadow: {trauma_enriched}")
    print(f"Trauma flagged for review:   {trauma_review}")
    print(f"Trauma SKUs:                {trauma_skus}")


if __name__ == "__main__":
    asyncio.run(run_merge())
