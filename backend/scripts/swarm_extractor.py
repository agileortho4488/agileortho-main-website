import os
import sys
import asyncio
import json
import logging
from typing import List, Set
from glob import glob

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.brochure_extractor import BrochureExtractor, ProductSpecs

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("swarm_extraction.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("SwarmOrchestrator")

SOURCE_DIR = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures"
CATALOG_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/frontend/src/data/catalog_products.json"

class SwarmOrchestrator:
    def __init__(self, concurrency: int = 2):
        self.extractor = BrochureExtractor(provider="gemini")
        self.semaphore = asyncio.Semaphore(concurrency)
        self.processed_files: Set[str] = set()
        self.results = {"total": 0, "success": 0, "failed": [], "matched": 0}

    def load_progress(self):
        if os.path.exists("swarm_progress.json"):
            with open("swarm_progress.json", "r") as f:
                self.processed_files = set(json.load(f))
            logger.info(f"Loaded progress: {len(self.processed_files)} files already processed.")

    def save_progress(self):
        with open("swarm_progress.json", "w") as f:
            json.dump(list(self.processed_files), f)

    async def process_file(self, pdf_path: str):
        file_name = os.path.basename(pdf_path)
        if file_name in self.processed_files:
            return

        async with self.semaphore:
            logger.info(f"--- Processing: {str(file_name.encode('utf-8', 'ignore').decode('utf-8'))} ---")
            retries = 3
            backoff = 60 # Start with 60s backoff for 429s

            while retries > 0:
                try:
                    data = await self.extractor.extract_pdf_data(pdf_path)
                    if data:
                        matched = await self.extractor.match_and_update_json(data)
                        self.results["success"] += 1
                        if matched:
                            self.results["matched"] += 1
                            logger.info(f"✅ Matched and updated: {data.product_name}")
                        else:
                            logger.info(f"ℹ️ Extracted '{data.product_name}', but no catalog match.")
                    
                    self.processed_files.add(file_name)
                    self.save_progress()
                    break # Success

                except Exception as e:
                    if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                        logger.warning(f"⚠️ Rate limit hit for {file_name}. Retrying in {backoff}s... (Retries left: {retries})")
                        await asyncio.sleep(backoff)
                        retries -= 1
                        backoff *= 2 # Exponential backoff
                    else:
                        logger.error(f"❌ Permanent error for {file_name}: {e}")
                        self.results["failed"].append({"file": file_name, "error": str(e)})
                        break

            # Mandatory gap between requests to respect RPM
            await asyncio.sleep(5)

    async def run(self):
        self.load_progress()
        pdf_files = glob(os.path.join(SOURCE_DIR, "**/*.pdf"), recursive=True)
        self.results["total"] = len(pdf_files)
        
        logger.info(f"Found {len(pdf_files)} PDFs. Starting swarm...")
        
        tasks = [self.process_file(f) for f in pdf_files]
        await asyncio.gather(*tasks)
        
        logger.info("\n--- SWARM EXTRACTION COMPLETE ---")
        logger.info(f"Total: {self.results['total']}")
        logger.info(f"Success: {self.results['success']}")
        logger.info(f"Matched: {self.results['matched']}")
        logger.info(f"Failed: {len(self.results['failed'])}")
        
        with open("swarm_report.json", "w") as f:
            json.dump(self.results, f, indent=2)

if __name__ == "__main__":
    orchestrator = SwarmOrchestrator(concurrency=1) # 1 worker for safety on free tier
    asyncio.run(orchestrator.run())
