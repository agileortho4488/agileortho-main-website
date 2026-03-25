from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Optional
from bson import ObjectId
from datetime import datetime, timezone
import os
import uuid
import json
import asyncio
import tempfile

from db import db, products_col
from helpers import (
    admin_required, serialize_doc, serialize_docs, escape_regex,
    put_object, get_object, get_mime_type, APP_NAME, EMERGENT_LLM_KEY,
)

router = APIRouter()

bulk_col = db["bulk_uploads"]
bulk_files_col = db["bulk_files"]

ALLOWED_EXTENSIONS = {
    "pdf", "jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "avi", "wmv",
    "pptx", "ppt", "doc", "docx", "xls", "xlsx",
}
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB per file


def get_file_ext(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def get_file_type(ext: str) -> str:
    if ext == "pdf":
        return "pdf"
    if ext in ("jpg", "jpeg", "png", "webp", "gif"):
        return "image"
    if ext in ("mp4", "mov", "avi", "wmv"):
        return "video"
    if ext in ("pptx", "ppt"):
        return "presentation"
    return "other"


# --- Upload single file (called sequentially from frontend) ---

@router.post("/api/admin/bulk-catalog/upload")
async def bulk_upload_file(
    file: UploadFile = File(...),
    job_id: str = Form(""),
    _=Depends(admin_required),
):
    ext = get_file_ext(file.filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"File type .{ext} not supported")

    # Create or get job
    if not job_id:
        job_doc = {
            "status": "uploading",
            "total_files": 0,
            "uploaded_files": 0,
            "processed_files": 0,
            "total_products_found": 0,
            "approved_products": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        result = await bulk_col.insert_one(job_doc)
        job_id = str(result.inserted_id)

    # Read file data
    data = await file.read()
    file_size = len(data)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(400, f"File too large ({file_size // (1024*1024)}MB). Max 200MB.")

    # Upload to object storage
    storage_path = f"{APP_NAME}/bulk/{job_id}/{uuid.uuid4().hex[:8]}_{file.filename}"
    content_type = file.content_type or get_mime_type(file.filename)

    try:
        store_result = put_object(storage_path, data, content_type)
    except Exception as e:
        raise HTTPException(500, f"Storage upload failed: {str(e)}")

    file_type = get_file_type(ext)

    file_doc = {
        "job_id": job_id,
        "filename": file.filename,
        "storage_path": store_result.get("path", storage_path),
        "content_type": content_type,
        "size": file_size,
        "extension": ext,
        "file_type": file_type,
        "status": "uploaded",  # uploaded → processing → completed → failed
        "extracted_products": [],
        "error": None,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await bulk_files_col.insert_one(file_doc)
    file_id = str(result.inserted_id)

    # Update job counters
    await bulk_col.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$inc": {"total_files": 1, "uploaded_files": 1},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()},
        }
    )

    return {
        "job_id": job_id,
        "file_id": file_id,
        "filename": file.filename,
        "size": file_size,
        "file_type": file_type,
        "storage_path": store_result.get("path", storage_path),
    }


# --- Get job status ---

@router.get("/api/admin/bulk-catalog/jobs")
async def list_bulk_jobs(_=Depends(admin_required)):
    cursor = bulk_col.find().sort("created_at", -1).limit(20)
    jobs = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        jobs.append(doc)
    return {"jobs": jobs}


@router.get("/api/admin/bulk-catalog/jobs/{job_id}")
async def get_bulk_job(job_id: str, _=Depends(admin_required)):
    try:
        doc = await bulk_col.find_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(400, "Invalid job ID")
    if not doc:
        raise HTTPException(404, "Job not found")
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/api/admin/bulk-catalog/jobs/{job_id}/files")
async def get_bulk_job_files(job_id: str, _=Depends(admin_required)):
    cursor = bulk_files_col.find({"job_id": job_id}).sort("uploaded_at", 1)
    files = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        files.append(doc)
    return {"files": files, "total": len(files)}


# --- Start processing ---

@router.post("/api/admin/bulk-catalog/jobs/{job_id}/process")
async def start_bulk_processing(job_id: str, _=Depends(admin_required)):
    try:
        job = await bulk_col.find_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(400, "Invalid job ID")
    if not job:
        raise HTTPException(404, "Job not found")

    if job.get("status") == "processing":
        raise HTTPException(400, "Already processing")

    await bulk_col.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": "processing", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )

    asyncio.create_task(_process_bulk_job(job_id))
    return {"status": "processing", "message": "Processing started"}


async def _process_bulk_job(job_id: str):
    """Process all PDF files in the job one by one."""
    try:
        cursor = bulk_files_col.find({
            "job_id": job_id,
            "file_type": "pdf",
            "status": "uploaded",
        })
        pdf_files = await cursor.to_list(500)

        processed = 0
        total_products = 0

        for f in pdf_files:
            file_id = str(f["_id"])
            try:
                await bulk_files_col.update_one(
                    {"_id": f["_id"]},
                    {"$set": {"status": "processing"}}
                )

                # Download from object storage
                storage_path = f["storage_path"]
                data, _ = get_object(storage_path)

                # Write to temp file
                tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
                tmp.write(data)
                tmp.close()

                # Extract products
                products = await _extract_from_pdf(tmp.name)

                # Clean up temp
                os.unlink(tmp.name)

                # Check duplicates
                for p in products:
                    p["_temp_id"] = uuid.uuid4().hex[:8]
                    p["approved"] = False
                    p["_source_file"] = f["filename"]
                    await _check_duplicate(p)

                await bulk_files_col.update_one(
                    {"_id": f["_id"]},
                    {"$set": {
                        "status": "completed",
                        "extracted_products": products,
                    }}
                )

                total_products += len(products)
                processed += 1

                # Update job progress
                await bulk_col.update_one(
                    {"_id": ObjectId(job_id)},
                    {"$set": {
                        "processed_files": processed,
                        "total_products_found": total_products,
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    }}
                )

            except Exception as e:
                await bulk_files_col.update_one(
                    {"_id": f["_id"]},
                    {"$set": {"status": "failed", "error": str(e)}}
                )
                processed += 1
                await bulk_col.update_one(
                    {"_id": ObjectId(job_id)},
                    {"$set": {
                        "processed_files": processed,
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    }}
                )

        # Mark job complete
        await bulk_col.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {
                "status": "completed",
                "total_products_found": total_products,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }}
        )

    except Exception as e:
        await bulk_col.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"status": "failed", "error": str(e), "updated_at": datetime.now(timezone.utc).isoformat()}}
        )


async def _extract_from_pdf(file_path: str) -> list:
    """Extract products from a PDF using text + vision fallback."""
    from routes.imports import (
        extract_pdf_text, extract_pdf_text_ocr,
        pdf_pages_to_base64, claude_extract_products,
        claude_extract_products_vision, claude_generate_seo,
    )

    pdf_text = extract_pdf_text(file_path)
    use_vision = False

    if not pdf_text or len(pdf_text) < 50:
        pdf_text = extract_pdf_text_ocr(file_path)

    if not pdf_text or len(pdf_text) < 50:
        use_vision = True
        page_images = pdf_pages_to_base64(file_path, max_pages=10)
        if not page_images:
            return []

    if use_vision:
        all_products = []
        for i in range(0, len(page_images), 3):
            batch = page_images[i:i+3]
            batch_products = await claude_extract_products_vision(batch)
            all_products.extend(batch_products)
            await asyncio.sleep(1)  # Rate limit buffer
        products = all_products
    else:
        products = await claude_extract_products(pdf_text)

    # Generate SEO for each
    for p in products:
        try:
            seo = await claude_generate_seo(p)
            if seo:
                p["description"] = seo.get("description", p.get("description", ""))
                p["seo_meta_title"] = seo.get("seo_meta_title", "")
                p["seo_meta_description"] = seo.get("seo_meta_description", "")
            await asyncio.sleep(0.5)
        except Exception:
            pass

    return products


async def _check_duplicate(product: dict):
    """Check if product is duplicate."""
    sku = product.get("sku_code", "").strip()
    name = product.get("product_name", "").strip()

    if sku:
        existing = await products_col.find_one(
            {"sku_code": sku, "status": "published"},
            {"_id": 0, "product_name": 1, "sku_code": 1}
        )
        if existing:
            product["_dup_status"] = "duplicate"
            product["_dup_match"] = f"{existing['product_name']} (SKU: {existing['sku_code']})"
            return

    if name:
        existing = await products_col.find_one(
            {"product_name": {"$regex": f"^{escape_regex(name)}$", "$options": "i"}, "status": "published"},
            {"_id": 0, "product_name": 1, "sku_code": 1}
        )
        if existing:
            product["_dup_status"] = "duplicate"
            product["_dup_match"] = f"{existing['product_name']} (SKU: {existing.get('sku_code', 'N/A')})"
            return

    product["_dup_status"] = "new"
    product["_dup_match"] = None


# --- Approve products ---

@router.post("/api/admin/bulk-catalog/jobs/{job_id}/approve")
async def approve_bulk_products(job_id: str, body: dict = {}, _=Depends(admin_required)):
    try:
        job = await bulk_col.find_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(400, "Invalid job ID")
    if not job:
        raise HTTPException(404, "Job not found")

    # Get all files with extracted products
    cursor = bulk_files_col.find({"job_id": job_id, "status": "completed"})
    files = await cursor.to_list(500)

    approve_ids = body.get("approve_ids", [])  # empty = approve all non-duplicates
    added = 0
    skipped = 0

    for f in files:
        updated_products = []
        for p in f.get("extracted_products", []):
            if p.get("approved"):
                updated_products.append(p)
                continue

            if approve_ids and p.get("_temp_id") not in approve_ids:
                updated_products.append(p)
                continue

            if p.get("_dup_status") == "duplicate":
                skipped += 1
                p["approved"] = True
                p["_dup_skipped"] = True
                updated_products.append(p)
                continue

            product_doc = {
                "product_name": p.get("product_name", "Unknown"),
                "sku_code": p.get("sku_code", f"BULK-{uuid.uuid4().hex[:6].upper()}"),
                "division": p.get("division", ""),
                "category": p.get("category", ""),
                "description": p.get("description", ""),
                "technical_specifications": p.get("technical_specifications", {}),
                "material": p.get("material", ""),
                "manufacturer": p.get("manufacturer", "Meril Life Sciences"),
                "size_variables": p.get("size_variables", []),
                "pack_size": p.get("pack_size", ""),
                "seo_meta_title": p.get("seo_meta_title", ""),
                "seo_meta_description": p.get("seo_meta_description", ""),
                "brochure_url": "",
                "images": [],
                "slug": p.get("product_name", "").lower().replace(" ", "-").replace("/", "-"),
                "status": "published",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }

            try:
                await products_col.insert_one(product_doc)
                p["approved"] = True
                added += 1
            except Exception:
                skipped += 1

            updated_products.append(p)

        await bulk_files_col.update_one(
            {"_id": f["_id"]},
            {"$set": {"extracted_products": updated_products}}
        )

    await bulk_col.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {
            "approved_products": added,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }}
    )

    return {"added": added, "skipped_duplicates": skipped}


# --- Delete job ---

@router.delete("/api/admin/bulk-catalog/jobs/{job_id}")
async def delete_bulk_job(job_id: str, _=Depends(admin_required)):
    try:
        await bulk_col.delete_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(400, "Invalid job ID")
    await bulk_files_col.delete_many({"job_id": job_id})
    return {"message": "Job deleted"}
