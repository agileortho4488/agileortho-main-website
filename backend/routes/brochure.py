import os
import glob
import asyncio
import json
from fastapi import APIRouter, Depends, BackgroundTasks
from services.brochure_extractor import extractor
from helpers import admin_required

router = APIRouter(prefix="/api/brochures", tags=["brochures"])

SOURCE_DIR = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures"
PROGRESS_FILE = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/processing_progress.json"

def _load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {}

def _save_progress(progress):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)

async def process_all_brochures(job_id: str):
    """Background task to iterate through all PDFs and extract data."""
    pdf_files = glob.glob(os.path.join(SOURCE_DIR, "**/*.pdf"), recursive=True)
    total = len(pdf_files)
    
    progress = _load_progress()
    progress[job_id] = {"status": "running", "total": total, "processed": 0, "matched": 0, "current_file": ""}
    _save_progress(progress)

    processed = 0
    matched = 0

    for pdf_path in pdf_files:
        try:
            # Extract
            data = await extractor.extract_pdf_data(pdf_path)
            if data:
                # Update JSON
                is_matched = await extractor.match_and_update_json(data)
                if is_matched:
                    matched += 1
            
            processed += 1
            
            # Update progress
            progress = _load_progress()
            progress[job_id].update({
                "processed": processed,
                "matched": matched,
                "current_file": os.path.basename(pdf_path)
            })
            _save_progress(progress)
            
            # Simple rate limiting/cooldown for Gemini API
            await asyncio.sleep(2) 

        except Exception as e:
            print(f"Error processing {pdf_path}: {e}")
            continue

    progress = _load_progress()
    progress[job_id]["status"] = "completed"
    _save_progress(progress)

@router.post("/batch-process")
async def start_batch_processing(background_tasks: BackgroundTasks, _=Depends(admin_required)):
    import uuid
    job_id = str(uuid.uuid4())
    
    progress = _load_progress()
    progress[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "total": 0,
        "processed": 0,
        "matched": 0
    }
    _save_progress(progress)
    
    background_tasks.add_task(process_all_brochures, job_id)
    return {"message": "Batch processing started", "job_id": job_id}

@router.get("/status/{job_id}")
async def get_processing_status(job_id: str):
    progress = _load_progress()
    status = progress.get(job_id)
    if not status:
        return {"error": "Job not found"}
    return status
