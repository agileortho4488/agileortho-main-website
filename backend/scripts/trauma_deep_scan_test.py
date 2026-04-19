import os
import asyncio
import json
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from services.brochure_extractor import extractor

PDF_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/Trauma/Plating System/ARMAR_Palting Titanium/Trauma PLATE Brochure.pdf"

async def test_extraction():
    print(f"--- STARTING DEEP SCAN: {os.path.basename(PDF_PATH)} ---")
    try:
        data = await extractor.extract_pdf_data(PDF_PATH)
        if data:
            print("\n[V3 EXTRACTION SUCCESSFUL]")
            print(json.dumps(data.model_dump(), indent=2))
            
            # Sync to JSON
            matched = await extractor.match_and_update_json(data)
            if matched:
                print(f"\n[SYNC SUCCESSFUL] Updated product: {data.product_name}")
            else:
                print("\n[SYNC FAILED] No match found in catalog_products.json")
        else:
            print("\n[V3 EXTRACTION FAILED]")
    except Exception as e:
        import traceback
        print(f"\n[V3 EXTRACTION EXCEPTION]: {e}")
        traceback.print_exc()
        print("\n[V3 EXTRACTION FAILED]")

if __name__ == "__main__":
    asyncio.run(test_extraction())
