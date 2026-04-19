import sys
import os
import asyncio
import glob
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.brochure_extractor import extractor

SOURCE_DIR = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures"

async def run_batch():
    pdf_files = glob.glob(os.path.join(SOURCE_DIR, "**/*.pdf"), recursive=True)
    total = len(pdf_files)
    print(f"Found {total} brochures. Starting extraction...")

    processed = 0
    matched = 0

    for pdf_path in pdf_files:
        file_name = os.path.basename(pdf_path)
        print(f"\n[{processed+1}/{total}] Processing: {file_name}")
        
        try:
            data = await extractor.extract_pdf_data(pdf_path)
            if data:
                is_matched = await extractor.match_and_update_json(data)
                if is_matched:
                    matched += 1
                    print(f"Successfully matched and updated: {data.product_name}")
                else:
                    print(f"Extraction worked for '{data.product_name}', but no match in catalog.")
            
            processed += 1
            
            # Rate limiting for Gemini API
            await asyncio.sleep(1) 

        except Exception as e:
            print(f"Error processing {file_name}: {e}")
            continue

    print(f"\n--- BATCH COMPLETE ---")
    print(f"Total Processed: {processed}")
    print(f"Total Matched: {matched}")

if __name__ == "__main__":
    asyncio.run(run_batch())
