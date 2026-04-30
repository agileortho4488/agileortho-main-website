import json
import os
import sys
from typing import List

# Add parent directory to sys.path to allow importing from 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.rag_service import rag_service
from langchain_core.documents import Document

CATALOG_PATH = '/Users/harsha/Desktop/agilehealthcare/repo/frontend/src/data/catalog_products.json'

def ingest_catalog():
    print("🚀 Starting Clinical Catalog Ingestion into Vector Store...")
    
    if not os.path.exists(CATALOG_PATH):
        print(f"❌ Error: Catalog file not found at {CATALOG_PATH}")
        return

    # Check for API Key
    if not os.getenv("GOOGLE_API_KEY"):
        print("⚠️ Warning: GOOGLE_API_KEY is not set in environment.")
        # We will still try to initialize, as rag_service might load from .env if it exists locally
    
    rag_service.initialize()
    
    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
    
    print(f"📦 Found {len(products)} products to index.")
    
    documents = []
    for p in products:
        name = p.get('product_name_display') or p.get('product_name')
        div = p.get('division_canonical', 'General')
        cat = p.get('category', 'Medical Device')
        desc = p.get('description_live') or p.get('description_shadow', '')
        
        # Build a rich context string for RAG
        context = f"Product: {name}\n"
        context += f"Division: {div}\n"
        context += f"Category: {cat}\n"
        context += f"Description: {desc}\n"
        
        if p.get('technical_specifications'):
            specs = json.dumps(p['technical_specifications'], indent=2)
            context += f"Technical Specifications:\n{specs}\n"
            
        if p.get('salient_features'):
            features = "\n- ".join(p['salient_features'])
            context += f"Salient Features:\n- {features}\n"
            
        doc = Document(
            page_content=context,
            metadata={
                "id": p.get('id'),
                "slug": p.get('slug'),
                "division": div,
                "category": cat,
                "source": "clinical_catalog"
            }
        )
        documents.append(doc)

    # Index in batches to avoid overhead
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        print(f"📥 Indexing batch {i//batch_size + 1} ({len(batch)} products)...")
        try:
            rag_service.vector_store.add_documents(batch)
        except Exception as e:
            print(f"❌ Failed to index batch {i//batch_size + 1}: {e}")
            
    print(f"\n✅ Successfully indexed {len(products)} products into ChromaDB.")

if __name__ == "__main__":
    ingest_catalog()
