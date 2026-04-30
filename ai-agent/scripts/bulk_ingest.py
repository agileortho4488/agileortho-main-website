import os
import time
import glob
from app.services.rag_service import rag_service

def ingest_folder(folder_path: str):
    print(f"Starting bulk ingestion from: {folder_path}")
    
    # Needs API key loaded
    rag_service.initialize()
    
    pdf_files = glob.glob(os.path.join(folder_path, "*.pdf"))
    
    print(f"Found {len(pdf_files)} PDF files to process.")
    
    success_count = 0
    fail_count = 0
    
    for i, pdf in enumerate(pdf_files):
        print(f"[{i+1}/{len(pdf_files)}] Ingesting {os.path.basename(pdf)}...")
        try:
            rag_service.index_pdf(pdf)
            success_count += 1
            # Add a small delay to avoid rate limiting from Gemini APIs
            time.sleep(2)
        except Exception as e:
            print(f"Failed to ingest {pdf}: {e}")
            fail_count += 1
            
    print(f"\nIngestion Complete! Successfully indexed {success_count} files. Failed: {fail_count}")

if __name__ == "__main__":
    folder_path = "/Users/harsha/Desktop/untitled folder 2"
    ingest_folder(folder_path)
