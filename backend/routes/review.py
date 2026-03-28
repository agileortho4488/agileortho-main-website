"""
Review Dashboard API — Admin endpoints for reviewing staged enrichment proposals.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime, timezone
from db import catalog_products_col, promotion_log_col, web_verification_log_col
from helpers import admin_required

router = APIRouter()

PROPOSED_FIELDS = [
    "proposed_entity_type", "proposed_clinical_display_title", "proposed_clinical_subtitle",
    "proposed_semantic_brand_system", "proposed_semantic_parent_brand",
    "proposed_semantic_system_type", "proposed_semantic_implant_class",
    "proposed_semantic_material_default", "proposed_semantic_coating_default",
    "proposed_semantic_anatomy_scope", "proposed_semantic_procedure_scope",
    "proposed_semantic_family_group", "proposed_semantic_use_case_tags",
    "proposed_semantic_confidence", "proposed_semantic_review_required",
    "proposed_web_verification_status", "proposed_recommended_action",
    "proposed_conflict_detected", "proposed_reasoning_summary", "proposed_enriched_at",
]


def clean_doc(doc):
    """Remove _id from doc for JSON response."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


@router.get("/api/admin/review/stats")
async def review_stats(_=Depends(admin_required)):
    total_staged = await catalog_products_col.count_documents(
        {"proposed_web_verification_status": {"$exists": True}}
    )
    total_canonical = await catalog_products_col.count_documents(
        {"semantic_brand_system": {"$nin": [None, ""]}}
    )
    total_products = await catalog_products_col.count_documents({})
    total_promoted = await promotion_log_col.count_documents({})

    # By status
    status_pipeline = [
        {"$match": {"proposed_web_verification_status": {"$exists": True}}},
        {"$group": {"_id": "$proposed_web_verification_status", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    by_status = await catalog_products_col.aggregate(status_pipeline).to_list(20)

    # By action
    action_pipeline = [
        {"$match": {"proposed_recommended_action": {"$exists": True}}},
        {"$group": {"_id": "$proposed_recommended_action", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    by_action = await catalog_products_col.aggregate(action_pipeline).to_list(20)

    # By division
    div_pipeline = [
        {"$match": {"proposed_web_verification_status": {"$exists": True}}},
        {"$group": {
            "_id": "$division_canonical",
            "total": {"$sum": 1},
            "review": {"$sum": {"$cond": [{"$eq": ["$proposed_recommended_action", "send_to_review"]}, 1, 0]}},
            "avg_conf": {"$avg": "$proposed_semantic_confidence"},
        }},
        {"$sort": {"total": -1}},
    ]
    by_division = await catalog_products_col.aggregate(div_pipeline).to_list(30)

    # Pending review (not yet promoted and has proposed fields)
    pending_review = await catalog_products_col.count_documents({
        "proposed_web_verification_status": {"$exists": True},
        "semantic_brand_system": {"$in": [None, ""]},
    })

    return {
        "total_products": total_products,
        "total_canonical": total_canonical,
        "total_staged": total_staged,
        "total_promoted": total_promoted,
        "pending_review": pending_review,
        "coverage_pct": round((total_canonical / total_products) * 100, 1) if total_products else 0,
        "by_status": [{"status": s["_id"], "count": s["count"]} for s in by_status],
        "by_action": [{"action": a["_id"], "count": a["count"]} for a in by_action],
        "by_division": [
            {
                "division": d["_id"] or "(none)",
                "total": d["total"],
                "review": d["review"],
                "avg_conf": round(d["avg_conf"], 2) if d["avg_conf"] else 0,
            }
            for d in by_division
        ],
    }


@router.get("/api/admin/review/products")
async def review_products(
    _=Depends(admin_required),
    division: Optional[str] = None,
    brand: Optional[str] = None,
    status: Optional[str] = None,
    action: Optional[str] = None,
    confidence_min: Optional[float] = None,
    confidence_max: Optional[float] = None,
    family: Optional[str] = None,
    pending_only: bool = True,
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1, le=100),
):
    query = {"proposed_web_verification_status": {"$exists": True}}

    if pending_only:
        query["semantic_brand_system"] = {"$in": [None, ""]}

    if division:
        query["division_canonical"] = division
    if brand:
        query["$or"] = [
            {"brand": {"$regex": brand, "$options": "i"}},
            {"proposed_semantic_brand_system": {"$regex": brand, "$options": "i"}},
        ]
    if status:
        query["proposed_web_verification_status"] = status
    if action:
        query["proposed_recommended_action"] = action
    if confidence_min is not None:
        query.setdefault("proposed_semantic_confidence", {})
        query["proposed_semantic_confidence"]["$gte"] = confidence_min
    if confidence_max is not None:
        query.setdefault("proposed_semantic_confidence", {})
        query["proposed_semantic_confidence"]["$lte"] = confidence_max
    if family:
        query["$or"] = [
            {"product_family": {"$regex": family, "$options": "i"}},
            {"proposed_semantic_family_group": {"$regex": family, "$options": "i"}},
        ]

    total = await catalog_products_col.count_documents(query)
    skip = (page - 1) * limit

    products = await catalog_products_col.find(
        query,
        {
            "_id": 0, "slug": 1, "product_name_display": 1, "brand": 1,
            "division_canonical": 1, "category": 1, "product_family": 1,
            "semantic_brand_system": 1, "semantic_confidence": 1,
            "proposed_clinical_display_title": 1, "proposed_semantic_brand_system": 1,
            "proposed_semantic_confidence": 1, "proposed_web_verification_status": 1,
            "proposed_recommended_action": 1, "proposed_conflict_detected": 1,
            "proposed_semantic_implant_class": 1, "proposed_semantic_family_group": 1,
            "proposed_reasoning_summary": 1,
        }
    ).sort("proposed_semantic_confidence", -1).skip(skip).limit(limit).to_list(limit)

    return {
        "products": products,
        "total": total,
        "page": page,
        "pages": max(1, -(-total // limit)),
    }


@router.get("/api/admin/review/products/{slug}")
async def review_product_detail(slug: str, _=Depends(admin_required)):
    product = await catalog_products_col.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(404, "Product not found")

    # Get verification log
    vlog = await web_verification_log_col.find_one(
        {"slug": slug}, {"_id": 0}
    )

    # Get promotion log (if previously promoted)
    plog = await promotion_log_col.find_one(
        {"slug": slug}, {"_id": 0}
    )

    # Build current vs proposed comparison
    current_fields = {
        "product_name_display": product.get("product_name_display", ""),
        "clinical_subtitle": product.get("clinical_subtitle", ""),
        "brand": product.get("brand", ""),
        "semantic_brand_system": product.get("semantic_brand_system", ""),
        "semantic_parent_brand": product.get("semantic_parent_brand", ""),
        "semantic_system_type": product.get("semantic_system_type", ""),
        "semantic_implant_class": product.get("semantic_implant_class", ""),
        "semantic_material_default": product.get("semantic_material_default"),
        "semantic_coating_default": product.get("semantic_coating_default"),
        "semantic_anatomy_scope": product.get("semantic_anatomy_scope", []),
        "semantic_confidence": product.get("semantic_confidence"),
        "mapping_confidence": product.get("mapping_confidence", ""),
    }

    proposed_fields = {
        "clinical_display_title": product.get("proposed_clinical_display_title", ""),
        "clinical_subtitle": product.get("proposed_clinical_subtitle", ""),
        "semantic_brand_system": product.get("proposed_semantic_brand_system", ""),
        "semantic_parent_brand": product.get("proposed_semantic_parent_brand", ""),
        "semantic_system_type": product.get("proposed_semantic_system_type", ""),
        "semantic_implant_class": product.get("proposed_semantic_implant_class", ""),
        "semantic_material_default": product.get("proposed_semantic_material_default"),
        "semantic_coating_default": product.get("proposed_semantic_coating_default"),
        "semantic_anatomy_scope": product.get("proposed_semantic_anatomy_scope", []),
        "semantic_confidence": product.get("proposed_semantic_confidence"),
        "web_verification_status": product.get("proposed_web_verification_status", ""),
        "recommended_action": product.get("proposed_recommended_action", ""),
        "conflict_detected": product.get("proposed_conflict_detected", False),
        "reasoning_summary": product.get("proposed_reasoning_summary", ""),
    }

    return {
        "product": product,
        "current": current_fields,
        "proposed": proposed_fields,
        "verification_log": vlog,
        "promotion_log": plog,
    }


@router.post("/api/admin/review/products/{slug}/approve")
async def approve_product(slug: str, _=Depends(admin_required)):
    product = await catalog_products_col.find_one({"slug": slug})
    if not product:
        raise HTTPException(404, "Product not found")

    conf = product.get("proposed_semantic_confidence", 0)
    action = product.get("proposed_recommended_action", "")
    status = product.get("proposed_web_verification_status", "")

    canonical_update = {
        "semantic_brand_system": product.get("proposed_semantic_brand_system", ""),
        "semantic_parent_brand": product.get("proposed_semantic_parent_brand", ""),
        "semantic_system_type": product.get("proposed_semantic_system_type", ""),
        "semantic_implant_class": product.get("proposed_semantic_implant_class", ""),
        "semantic_material_default": product.get("proposed_semantic_material_default"),
        "semantic_coating_default": product.get("proposed_semantic_coating_default"),
        "semantic_anatomy_scope": product.get("proposed_semantic_anatomy_scope", []),
        "semantic_confidence": conf,
        "semantic_review_required": False,
        "semantic_enriched_at": datetime.now(timezone.utc).isoformat(),
        "semantic_rule_hits": [f"MANUAL_APPROVE_{status.upper()}"],
        "semantic_conflict_codes": [],
    }

    if action == "rename" and product.get("proposed_clinical_display_title"):
        canonical_update["product_name_display"] = product["proposed_clinical_display_title"]
    if product.get("proposed_clinical_subtitle"):
        canonical_update["clinical_subtitle"] = product["proposed_clinical_subtitle"]
    if not product.get("brand") and product.get("proposed_semantic_brand_system"):
        canonical_update["brand"] = product["proposed_semantic_brand_system"]

    canonical_update["mapping_confidence"] = "high" if conf >= 0.9 else ("medium" if conf >= 0.75 else "low")
    canonical_update["review_required"] = False

    await catalog_products_col.update_one({"_id": product["_id"]}, {"$set": canonical_update})

    await promotion_log_col.insert_one({
        "product_id": str(product["_id"]),
        "slug": slug,
        "action": "manual_approve",
        "reviewer": "admin",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "verification_status": status,
        "confidence": conf,
        "recommended_action": action,
        "fields_changed": list(canonical_update.keys()),
        "old_values": {
            "semantic_brand_system": product.get("semantic_brand_system", ""),
            "semantic_confidence": product.get("semantic_confidence"),
        },
        "new_values": {
            "semantic_brand_system": canonical_update.get("semantic_brand_system", ""),
            "semantic_confidence": canonical_update.get("semantic_confidence"),
        },
    })

    return {"status": "approved", "slug": slug}


@router.post("/api/admin/review/products/{slug}/reject")
async def reject_product(slug: str, _=Depends(admin_required)):
    product = await catalog_products_col.find_one({"slug": slug})
    if not product:
        raise HTTPException(404, "Product not found")

    # Clear proposed fields
    unset_fields = {f: "" for f in PROPOSED_FIELDS}
    await catalog_products_col.update_one({"_id": product["_id"]}, {"$unset": unset_fields})

    await promotion_log_col.insert_one({
        "product_id": str(product["_id"]),
        "slug": slug,
        "action": "manual_reject",
        "reviewer": "admin",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "fields_changed": list(unset_fields.keys()),
    })

    return {"status": "rejected", "slug": slug}


@router.post("/api/admin/review/products/{slug}/edit-approve")
async def edit_approve_product(slug: str, body: dict, _=Depends(admin_required)):
    product = await catalog_products_col.find_one({"slug": slug})
    if not product:
        raise HTTPException(404, "Product not found")

    edits = body.get("edits", {})

    # Apply edits to proposed fields first
    for key, value in edits.items():
        proposed_key = f"proposed_{key}" if not key.startswith("proposed_") else key
        await catalog_products_col.update_one(
            {"_id": product["_id"]}, {"$set": {proposed_key: value}}
        )

    # Re-fetch and promote
    product = await catalog_products_col.find_one({"_id": product["_id"]})

    conf = product.get("proposed_semantic_confidence", 0)
    status = product.get("proposed_web_verification_status", "")

    canonical_update = {
        "semantic_brand_system": product.get("proposed_semantic_brand_system", ""),
        "semantic_parent_brand": product.get("proposed_semantic_parent_brand", ""),
        "semantic_system_type": product.get("proposed_semantic_system_type", ""),
        "semantic_implant_class": product.get("proposed_semantic_implant_class", ""),
        "semantic_material_default": product.get("proposed_semantic_material_default"),
        "semantic_coating_default": product.get("proposed_semantic_coating_default"),
        "semantic_anatomy_scope": product.get("proposed_semantic_anatomy_scope", []),
        "semantic_confidence": conf,
        "semantic_review_required": False,
        "semantic_enriched_at": datetime.now(timezone.utc).isoformat(),
        "semantic_rule_hits": [f"MANUAL_EDIT_APPROVE_{status.upper()}"],
        "semantic_conflict_codes": [],
        "mapping_confidence": "high" if conf >= 0.9 else ("medium" if conf >= 0.75 else "low"),
        "review_required": False,
    }

    if product.get("proposed_clinical_display_title"):
        canonical_update["product_name_display"] = product["proposed_clinical_display_title"]
    if product.get("proposed_clinical_subtitle"):
        canonical_update["clinical_subtitle"] = product["proposed_clinical_subtitle"]
    if not product.get("brand") and product.get("proposed_semantic_brand_system"):
        canonical_update["brand"] = product["proposed_semantic_brand_system"]

    await catalog_products_col.update_one({"_id": product["_id"]}, {"$set": canonical_update})

    await promotion_log_col.insert_one({
        "product_id": str(product["_id"]),
        "slug": slug,
        "action": "manual_edit_approve",
        "reviewer": "admin",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "edits_applied": edits,
        "fields_changed": list(canonical_update.keys()),
    })

    return {"status": "edit_approved", "slug": slug}


@router.post("/api/admin/review/bulk-approve")
async def bulk_approve(body: dict, _=Depends(admin_required)):
    """Bulk approve products by family, brand, or explicit slug list."""
    slugs = body.get("slugs", [])
    family = body.get("family")
    brand = body.get("brand")
    division = body.get("division")

    query = {
        "proposed_web_verification_status": {"$exists": True},
        "semantic_brand_system": {"$in": [None, ""]},
    }

    if slugs:
        query["slug"] = {"$in": slugs}
    elif family:
        query["$or"] = [
            {"product_family": {"$regex": family, "$options": "i"}},
            {"proposed_semantic_family_group": {"$regex": family, "$options": "i"}},
        ]
        if division:
            query["division_canonical"] = division
    elif brand:
        query["$or"] = [
            {"brand": {"$regex": brand, "$options": "i"}},
            {"proposed_semantic_brand_system": {"$regex": brand, "$options": "i"}},
        ]
    else:
        raise HTTPException(400, "Provide slugs, family, or brand for bulk approve")

    products = await catalog_products_col.find(query).to_list(500)
    approved = 0

    for product in products:
        conf = product.get("proposed_semantic_confidence", 0)
        status = product.get("proposed_web_verification_status", "")
        action_rec = product.get("proposed_recommended_action", "")

        canonical_update = {
            "semantic_brand_system": product.get("proposed_semantic_brand_system", ""),
            "semantic_parent_brand": product.get("proposed_semantic_parent_brand", ""),
            "semantic_system_type": product.get("proposed_semantic_system_type", ""),
            "semantic_implant_class": product.get("proposed_semantic_implant_class", ""),
            "semantic_material_default": product.get("proposed_semantic_material_default"),
            "semantic_coating_default": product.get("proposed_semantic_coating_default"),
            "semantic_anatomy_scope": product.get("proposed_semantic_anatomy_scope", []),
            "semantic_confidence": conf,
            "semantic_review_required": False,
            "semantic_enriched_at": datetime.now(timezone.utc).isoformat(),
            "semantic_rule_hits": [f"BULK_APPROVE_{status.upper()}"],
            "semantic_conflict_codes": [],
            "mapping_confidence": "high" if conf >= 0.9 else ("medium" if conf >= 0.75 else "low"),
            "review_required": False,
        }

        if action_rec == "rename" and product.get("proposed_clinical_display_title"):
            canonical_update["product_name_display"] = product["proposed_clinical_display_title"]
        if product.get("proposed_clinical_subtitle"):
            canonical_update["clinical_subtitle"] = product["proposed_clinical_subtitle"]
        if not product.get("brand") and product.get("proposed_semantic_brand_system"):
            canonical_update["brand"] = product["proposed_semantic_brand_system"]

        await catalog_products_col.update_one({"_id": product["_id"]}, {"$set": canonical_update})

        await promotion_log_col.insert_one({
            "product_id": str(product["_id"]),
            "slug": product.get("slug", ""),
            "action": "bulk_approve",
            "reviewer": "admin",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "confidence": conf,
        })
        approved += 1

    return {"status": "bulk_approved", "count": approved}


@router.get("/api/admin/review/families")
async def review_families(
    _=Depends(admin_required),
    division: Optional[str] = None,
    pending_only: bool = True,
):
    """Group review products by family for family-level review."""
    query = {"proposed_web_verification_status": {"$exists": True}}
    if pending_only:
        query["semantic_brand_system"] = {"$in": [None, ""]}
    if division:
        query["division_canonical"] = division

    pipeline = [
        {"$match": query},
        {"$group": {
            "_id": {
                "family": {"$ifNull": ["$proposed_semantic_family_group", "$product_family"]},
                "division": "$division_canonical",
            },
            "count": {"$sum": 1},
            "avg_confidence": {"$avg": "$proposed_semantic_confidence"},
            "brands": {"$addToSet": "$proposed_semantic_brand_system"},
            "statuses": {"$addToSet": "$proposed_web_verification_status"},
            "actions": {"$addToSet": "$proposed_recommended_action"},
            "sample_slugs": {"$push": "$slug"},
            "has_conflict": {"$max": "$proposed_conflict_detected"},
        }},
        {"$sort": {"count": -1}},
    ]
    families = await catalog_products_col.aggregate(pipeline).to_list(200)

    return {
        "families": [
            {
                "family": f["_id"]["family"] or "(unnamed)",
                "division": f["_id"]["division"] or "(none)",
                "count": f["count"],
                "avg_confidence": round(f["avg_confidence"], 2) if f["avg_confidence"] else 0,
                "brands": [b for b in f["brands"] if b],
                "statuses": f["statuses"],
                "actions": f["actions"],
                "sample_slugs": f["sample_slugs"][:5],
                "has_conflict": f["has_conflict"] or False,
            }
            for f in families
        ],
        "total_families": len(families),
    }



@router.get("/api/admin/review/smart-suggestions")
async def smart_suggestions(
    _=Depends(admin_required),
    division: Optional[str] = None,
    min_family_size: int = Query(2, ge=2),
):
    """Analyze families and return smart bulk-approve suggestions.

    A family is eligible only when ALL criteria are met:
    - Same division_canonical across all members
    - Same brand (or proposed_semantic_brand_system)
    - No conflict flags on any member
    - No material/coating disagreement within the family
    - Avg proposed_semantic_confidence >= 0.85
    - Minimum family size threshold met
    - No member has review_required_conflict status
    """
    # Gather all pending-review products with proposed fields
    query = {
        "proposed_web_verification_status": {"$exists": True},
        "semantic_brand_system": {"$in": [None, ""]},
    }
    if division:
        query["division_canonical"] = division

    products = await catalog_products_col.find(query, {"_id": 0}).to_list(5000)

    # Group by family key: (division, brand, family_group)
    families = {}
    for p in products:
        div = p.get("division_canonical", "")
        brand = p.get("proposed_semantic_brand_system") or p.get("brand") or ""
        family = p.get("proposed_semantic_family_group") or p.get("product_family") or ""
        if not family:
            continue
        key = f"{div}||{brand}||{family}"
        families.setdefault(key, []).append(p)

    suggestions = []

    for key, members in families.items():
        if len(members) < min_family_size:
            continue

        parts = key.split("||")
        div, brand, family = parts[0], parts[1], parts[2]

        # --- Eligibility checks ---
        exclusions = []
        excluded_slugs = []

        # Check 1: Division consistency
        divs = set(m.get("division_canonical", "") for m in members)
        if len(divs) > 1:
            exclusions.append("mixed_divisions")

        # Check 2: Brand consistency
        brands = set()
        for m in members:
            b = m.get("proposed_semantic_brand_system") or m.get("brand") or ""
            if b:
                brands.add(b.upper())
        if len(brands) > 1:
            exclusions.append("cross_brand_bundle")

        # Check 3: Conflict flags
        conflict_members = []
        for m in members:
            if m.get("proposed_conflict_detected"):
                conflict_members.append(m.get("slug", ""))
            if m.get("proposed_web_verification_status") == "review_required_conflict":
                conflict_members.append(m.get("slug", ""))
        if conflict_members:
            exclusions.append("has_conflict_flags")
            excluded_slugs.extend(list(set(conflict_members)))

        # Check 4: Material/coating disagreement
        materials = set()
        coatings = set()
        for m in members:
            mat = m.get("proposed_semantic_material_default") or ""
            coat = m.get("proposed_semantic_coating_default") or ""
            if mat:
                materials.add(mat.upper().strip())
            if coat:
                coatings.add(coat.upper().strip())

        # Ti vs SS ambiguity detection
        material_keywords = {mat.lower() for mat in materials}
        has_titanium = any("titan" in mk for mk in material_keywords)
        has_steel = any("steel" in mk or "ss " in mk or "ss316" in mk for mk in material_keywords)
        if has_titanium and has_steel:
            exclusions.append("ti_vs_ss_material_ambiguity")

        if len(materials) > 1 and "ti_vs_ss_material_ambiguity" not in exclusions:
            exclusions.append("mixed_materials")

        # Mixed coated/uncoated
        has_coated = any(c for c in coatings if c and c.lower() != "none")
        has_uncoated = any(not m.get("proposed_semantic_coating_default") for m in members)
        if has_coated and has_uncoated:
            exclusions.append("mixed_coated_uncoated")

        # Check 5: Avg confidence >= 0.85
        confs = [m.get("proposed_semantic_confidence", 0) for m in members]
        avg_conf = sum(confs) / len(confs) if confs else 0
        min_conf = min(confs) if confs else 0
        max_conf = max(confs) if confs else 0

        if avg_conf < 0.85:
            exclusions.append("avg_confidence_below_threshold")

        # Check 6: No member with send_to_review due to conflict
        conflict_review_members = [
            m.get("slug", "") for m in members
            if m.get("proposed_recommended_action") == "send_to_review"
            and m.get("proposed_web_verification_status") == "review_required_conflict"
        ]
        if conflict_review_members:
            if "has_conflict_flags" not in exclusions:
                exclusions.append("conflict_review_members")
            excluded_slugs.extend(conflict_review_members)

        # Separate eligible vs excluded members
        excluded_slug_set = set(excluded_slugs)
        eligible_members = [m for m in members if m.get("slug", "") not in excluded_slug_set]
        excluded_members = [m for m in members if m.get("slug", "") in excluded_slug_set]

        # If global exclusions (affects whole family), nobody is eligible
        global_exclusions = {"mixed_divisions", "cross_brand_bundle", "ti_vs_ss_material_ambiguity",
                             "mixed_coated_uncoated", "avg_confidence_below_threshold"}
        has_global_exclusion = bool(set(exclusions) & global_exclusions)

        is_eligible = len(exclusions) == 0
        is_partially_eligible = not is_eligible and not has_global_exclusion and len(eligible_members) >= min_family_size

        # Compute smart score (0-100)
        score = 0
        if avg_conf >= 0.95:
            score += 40
        elif avg_conf >= 0.90:
            score += 30
        elif avg_conf >= 0.85:
            score += 20
        if len(exclusions) == 0:
            score += 30
        elif len(exclusions) == 1 and not has_global_exclusion:
            score += 15
        if len(members) >= 5:
            score += 15
        elif len(members) >= 3:
            score += 10
        else:
            score += 5
        if not has_global_exclusion:
            score += 15

        # Build reason string
        if is_eligible:
            reason = (
                f"All {len(members)} members share the same division ({div}), "
                f"brand ({brand}), and family group. "
                f"Avg confidence {avg_conf:.2f}, no conflicts, no material disagreements. "
                f"Safe for bulk approval."
            )
        elif is_partially_eligible:
            reason = (
                f"{len(eligible_members)}/{len(members)} members eligible. "
                f"{len(excluded_members)} excluded: {', '.join(exclusions)}. "
                f"Eligible members can be bulk-approved; excluded need individual review."
            )
        else:
            reason = f"Not eligible: {', '.join(exclusions)}."

        # Implant class consistency
        classes = set(m.get("proposed_semantic_implant_class", "") for m in members if m.get("proposed_semantic_implant_class"))

        suggestions.append({
            "family": family,
            "division": div,
            "brand": brand,
            "family_size": len(members),
            "smart_approve_eligible": is_eligible,
            "partially_eligible": is_partially_eligible,
            "smart_approve_score": min(score, 100),
            "smart_approve_reason": reason,
            "smart_approve_exclusion_count": len(excluded_members),
            "smart_approve_exclusion_reasons": exclusions,
            "avg_confidence": round(avg_conf, 2),
            "min_confidence": round(min_conf, 2),
            "max_confidence": round(max_conf, 2),
            "implant_classes": list(classes),
            "eligible_count": len(eligible_members) if not has_global_exclusion else 0,
            "eligible_slugs": [m.get("slug", "") for m in eligible_members] if not has_global_exclusion else [],
            "excluded_count": len(excluded_members) if not has_global_exclusion else len(members),
            "excluded_slugs": [m.get("slug", "") for m in excluded_members] if not has_global_exclusion else [m.get("slug", "") for m in members],
            "sample_titles": [m.get("proposed_clinical_display_title") or m.get("product_name_display", "") for m in members[:4]],
        })

    # Sort: eligible first, then by score desc
    suggestions.sort(key=lambda s: (-int(s["smart_approve_eligible"]), -int(s["partially_eligible"]), -s["smart_approve_score"]))

    # Summary counts
    total_eligible = sum(1 for s in suggestions if s["smart_approve_eligible"])
    total_partial = sum(1 for s in suggestions if s["partially_eligible"])
    total_ineligible = len(suggestions) - total_eligible - total_partial
    total_products_clearable = sum(s["eligible_count"] for s in suggestions if s["smart_approve_eligible"] or s["partially_eligible"])

    return {
        "suggestions": suggestions,
        "summary": {
            "total_families_analyzed": len(suggestions),
            "fully_eligible": total_eligible,
            "partially_eligible": total_partial,
            "ineligible": total_ineligible,
            "total_products_clearable": total_products_clearable,
        },
    }
