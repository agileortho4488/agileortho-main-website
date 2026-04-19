import os
import asyncio
import json
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.brochure_extractor import extractor

TRAUMA_DIR = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/Trauma"
SKIP_FILES = ["Trauma Training Manual", "Trauma_ Organogram", ".DS_Store"]

import glob

async def run_trauma_batch():
    pdf_files = glob.glob(os.path.join(TRAUMA_DIR, "**/*.pdf"), recursive=True)
    # Filter out non-product brochures
    pdf_files = [
        f for f in pdf_files 
        if not any(skip in f for skip in SKIP_FILES)
    ]

    total = len(pdf_files)
    print(f"🔬 TRAUMA DEEP SCAN: Found {total} brochures to process\n")

    processed = 0
    matched = 0
    failed = []

    for pdf_path in pdf_files:
        file_name = os.path.basename(pdf_path)
        print(f"[{processed+1}/{total}] Scanning: {file_name}")
        
        try:
            data = await extractor.extract_pdf_data(pdf_path)
            if data:
                is_matched = await extractor.match_and_update_json(data)
                if is_matched:
                    matched += 1
                    print(f"  ✅ Synced: {data.product_name} ({len(data.catalog_matches)} catalog entries updated)")
                else:
                    print(f"  ⚠️  Extracted '{data.product_name}' but no catalog match — marking for manual review")
                    failed.append({"file": file_name, "extracted_name": data.product_name})
            else:
                print(f"  ❌ Extraction returned no data")
                failed.append({"file": file_name, "extracted_name": None})

            processed += 1
            # Rate limiting: 2 seconds between calls
            await asyncio.sleep(2)

        except Exception as e:
            print(f"  💥 Error: {e}")
            failed.append({"file": file_name, "error": str(e)})
            await asyncio.sleep(3)  # Longer wait on error
            continue

    print(f"\n{'='*60}")
    print(f"🏁 TRAUMA BATCH COMPLETE")
    print(f"   Total Brochures: {total}")
    print(f"   Successfully Synced: {matched}")
    print(f"   Failed/Unmatched: {len(failed)}")
    print(f"{'='*60}")

    if failed:
        print(f"\n📋 Failed items (for manual review):")
        for item in failed:
            print(f"   • {item}")

    # Save report
    report = {
        "run_timestamp": str(asyncio.get_event_loop().time()),
        "total": total,
        "matched": matched,
        "failed": failed
    }
    report_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trauma_extraction_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\n📄 Report saved: {report_path}")

if __name__ == "__main__":
    asyncio.run(run_trauma_batch())
