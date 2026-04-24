import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv("/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/.env")

# Add the parent directory to sys.path to import the extractor
sys.path.append("/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend")

from services.brochure_extractor import extractor

async def main():
    pdf_path = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/Trauma/Nailling system/Nailling system/CLAVO_Titanium_Nailing/Nail_CLAVO_Ti_Catalogue_Meril.pdf"
    
    print(f"Starting extraction for: {pdf_path}")
    data = await extractor.extract_pdf_data(pdf_path)
    
    if data:
        print(f"Extraction successful: {data.product_name}")
        success = await extractor.match_and_update_json(data)
        if success:
            print("Catalog updated successfully.")
        else:
            print("No matches found in catalog.")
    else:
        print("Extraction failed.")

if __name__ == "__main__":
    asyncio.run(main())
