import asyncio
import os
import sys
import time
import logging
from dotenv import load_dotenv

load_dotenv("/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/.env")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("brochure_processing.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Add the parent directory to sys.path to import the extractor
sys.path.append("/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend")

from services.brochure_extractor import extractor

SOURCE_DIR = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures"
PROCESSED_LOG = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/processed_brochures.txt"

def get_processed_files():
    if os.path.exists(PROCESSED_LOG):
        with open(PROCESSED_LOG, 'r') as f:
            return set(line.strip() for line in f)
    return set()

def mark_as_processed(file_path):
    with open(PROCESSED_LOG, 'a') as f:
        f.write(f"{file_path}\n")

async def process_directory(directory, processed_files):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.pdf'):
                full_path = os.path.join(root, file)
                
                if os.path.getsize(full_path) > 50 * 1024 * 1024:
                    logger.warning(f"Skipping too large file (>50MB): {file}")
                    continue

                if full_path in processed_files:
                    logger.info(f"Skipping already processed: {file}")
                    continue
                
                logger.info(f"Starting extraction for: {full_path}")
                try:
                    data = await extractor.extract_pdf_data(full_path)
                    if data:
                        logger.info(f"Extraction successful: {data.product_name}")
                        success = await extractor.match_and_update_json(data)
                        if success:
                            logger.info(f"Catalog updated for {data.product_name}")
                        else:
                            logger.warning(f"No matches found for {data.product_name}")
                        
                        mark_as_processed(full_path)
                    else:
                        logger.error(f"Extraction failed (no data returned) for {file}")
                except Exception as e:
                    logger.error(f"Error processing {file}: {e}")
                
                # Rate limiting to preserve quota and avoid 429
                logger.info("Waiting 60 seconds for quota reset...")
                await asyncio.sleep(60)

async def main():
    load_dotenv("/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/.env")
    
    processed_files = get_processed_files()
    logger.info(f"Starting batch processing. {len(processed_files)} files already processed.")
    
    await process_directory(SOURCE_DIR, processed_files)
    logger.info("Batch processing complete.")

if __name__ == "__main__":
    asyncio.run(main())
