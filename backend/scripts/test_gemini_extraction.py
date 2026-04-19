import sys
import os
import asyncio
import json

# Add parent directory to path to import services/db
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.brochure_extractor import extractor

async def test_single_extraction():
    # Use a known brochure
    pdf_path = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/Destiknee Brochure.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        # Try to find any PDF in the directory
        import glob
        files = glob.glob("/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/*.pdf")
        if files:
            pdf_path = files[0]
        else:
            print("No PDF files found in source_brochures")
            return

    print(f"Testing Gemini extraction on: {os.path.basename(pdf_path)}")
    
    try:
        data = await extractor.extract_pdf_data(pdf_path)
        if data:
            print("\n--- EXTRACTED DATA ---")
            print(json.dumps(data.model_dump(), indent=2))
            
            print("\n--- ATTEMPTING DB MATCH ---")
            matched = await extractor.match_and_update_json(data)
            if matched:
                print("Successfully matched and updated JSON catalog!")
            else:
                print("Extraction worked, but no strong match found in catalog.")
        else:
            print("Extraction failed or returned no data.")
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    asyncio.run(test_single_extraction())
