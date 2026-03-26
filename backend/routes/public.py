from fastapi import APIRouter, HTTPException, Response, Query
from fastapi.responses import StreamingResponse
from typing import Optional
from bson import ObjectId
from datetime import datetime, timezone
import math
import asyncio
import io

from db import products_col, leads_col
from models import LeadCreate
from helpers import serialize_doc, serialize_docs, calculate_lead_score, get_object

router = APIRouter()


@router.get("/api/health")
async def health():
    return {"status": "ok", "service": "Agile Ortho API"}


@router.get("/api/divisions")
async def get_divisions():
    pipeline = [
        {"$match": {"status": "published"}},
        {"$group": {
            "_id": "$division",
            "categories": {"$addToSet": "$category"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    results = await products_col.aggregate(pipeline).to_list(100)
    divisions = []
    for r in results:
        cats = sorted([c for c in r["categories"] if c])
        divisions.append({
            "name": r["_id"],
            "categories": cats,
            "product_count": r["count"]
        })
    return {"divisions": divisions}


@router.get("/api/products")
async def list_products(
    division: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    status: str = "published",
    page: int = 1,
    limit: int = 20
):
    query = {"status": status}
    if division:
        query["division"] = division
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"product_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"sku_code": {"$regex": search, "$options": "i"}},
        ]

    total = await products_col.count_documents(query)
    skip = (page - 1) * limit
    cursor = products_col.find(query).sort("product_name", 1).skip(skip).limit(limit)
    docs = await cursor.to_list(limit)

    return {
        "products": serialize_docs(docs),
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total > 0 else 1
    }


@router.get("/api/products/featured/homepage")
async def get_featured_products():
    """Get diverse featured products across divisions for homepage."""
    divisions = await products_col.distinct("division")
    featured = []
    for div in divisions:
        prods = await products_col.find(
            {"division": div, "images.0": {"$exists": True}},
            {"_id": 1, "product_name": 1, "division": 1, "category": 1,
             "description": 1, "images": {"$slice": 1}, "sku_code": 1}
        ).limit(1).to_list(1)
        if prods:
            featured.append(prods[0])
    from helpers import serialize_docs
    return {"products": serialize_docs(featured)[:8]}


@router.get("/api/products/{product_id}")
async def get_product(product_id: str):
    try:
        doc = await products_col.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(400, "Invalid product ID")
    if not doc:
        raise HTTPException(404, "Product not found")
    return serialize_doc(doc)


@router.get("/api/products/by-slug/{slug}")
async def get_product_by_slug(slug: str):
    doc = await products_col.find_one({"slug": slug, "status": "published"})
    if not doc:
        raise HTTPException(404, "Product not found")
    return serialize_doc(doc)


@router.post("/api/leads")
async def create_lead(lead: LeadCreate):
    score_label, score_value = calculate_lead_score(lead.model_dump())
    doc = {
        **lead.model_dump(),
        "score": score_label,
        "score_value": score_value,
        "status": "new",
        "assigned_to": "",
        "notes": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await leads_col.insert_one(doc)
    doc.pop("_id", None)
    doc["id"] = str(result.inserted_id)

    if lead.phone_whatsapp:
        from routes.whatsapp import track_user_in_interakt, track_event_in_interakt
        asyncio.create_task(track_user_in_interakt(
            lead.phone_whatsapp, name=lead.name, email=lead.email or "",
            traits={"hospital": lead.hospital_clinic or "", "district": lead.district or "",
                    "inquiry_type": lead.inquiry_type or "", "product_interest": lead.product_interest or ""},
            tags=["website-lead", f"score-{score_label.lower()}"]
        ))
        asyncio.create_task(track_event_in_interakt(
            lead.phone_whatsapp, "Lead Created",
            {"source": lead.source or "website", "inquiry_type": lead.inquiry_type or "",
             "product_interest": lead.product_interest or ""}
        ))

    return {"message": "Lead captured successfully", "lead": doc}


@router.get("/api/files/{path:path}")
async def serve_file(path: str):
    try:
        data, content_type = get_object(path)
        return Response(content=data, media_type=content_type)
    except Exception:
        raise HTTPException(404, "File not found")



@router.post("/api/brochure-download")
async def gated_brochure_download(data: dict):
    """Gated brochure download - collect lead details before providing download"""
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    product_id = data.get("product_id", "")
    email = (data.get("email") or "").strip()
    hospital = (data.get("hospital") or "").strip()
    district = (data.get("district") or "").strip()

    if not name or not phone:
        raise HTTPException(400, "Name and phone number are required")

    # Find the product and its brochure
    product = None
    if product_id:
        try:
            product = await products_col.find_one({"_id": ObjectId(product_id)})
        except Exception:
            pass

    brochure_path = product.get("brochure_url") or product.get("brochure")
    if not product or not brochure_path:
        raise HTTPException(404, "Brochure not found for this product")

    # Remove leading /api/files/ or /api/public/files/ if present
    if brochure_path.startswith("/api/files/"):
        brochure_path = brochure_path[len("/api/files/"):]
    elif brochure_path.startswith("/api/public/files/"):
        brochure_path = brochure_path[len("/api/public/files/"):]

    # Create or update lead
    existing = await leads_col.find_one({"phone_whatsapp": phone})
    now = datetime.now(timezone.utc).isoformat()

    if existing:
        update_set = {"updated_at": now}
        update_ops = {"$set": update_set, "$addToSet": {"brochure_downloads": product.get("product_name", "")}}
        # Only push to notes if it's an array
        if isinstance(existing.get("notes"), list):
            update_ops["$push"] = {"notes": {
                "text": f"Downloaded brochure: {product.get('product_name', '')}",
                "date": now, "author": "system"
            }}
        if hospital and not existing.get("hospital_clinic"):
            update_set["hospital_clinic"] = hospital
        if email and not existing.get("email"):
            update_set["email"] = email
        await leads_col.update_one({"_id": existing["_id"]}, update_ops)
    else:
        score_label = calculate_lead_score({"name": name, "phone_whatsapp": phone,
            "hospital_clinic": hospital, "email": email, "district": district,
            "inquiry_type": "Brochure Download", "product_interest": product.get("product_name", "")})
        lead_doc = {
            "name": name, "phone_whatsapp": phone, "email": email,
            "hospital_clinic": hospital, "district": district,
            "inquiry_type": "Brochure Download",
            "product_interest": product.get("product_name", ""),
            "source": "brochure_gate", "score": score_label, "stage": "new",
            "assigned_to": "", "notes": [],
            "brochure_downloads": [product.get("product_name", "")],
            "created_at": now, "updated_at": now
        }
        await leads_col.insert_one(lead_doc)

    # Return the download path
    return {
        "message": "Details captured. Starting download.",
        "download_url": f"/api/files/{brochure_path}",
        "product_name": product.get("product_name", ""),
    }
