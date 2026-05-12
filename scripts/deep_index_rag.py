import json
import os
import sys
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from dotenv import load_dotenv

# Determine paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(os.path.dirname(ROOT_DIR), '.env'))

CATALOG_PATH = os.path.join(ROOT_DIR, 'frontend/src/data/catalog_products.json')
DB_DIR = os.path.join(os.path.dirname(ROOT_DIR), 'chroma_db')

def deep_index():
    print(f"Loading catalog from {CATALOG_PATH}...")
    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)

    print("Initializing Google embeddings...")
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: GOOGLE_API_KEY not set.")
        return

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

    documents = []
    for p in products:
        # Create a rich text blob for indexing
        content = f"PRODUCT NAME: {p.get('product_name')}\n"
        content += f"DIVISION: {p.get('division')}\n"
        content += f"CATEGORY: {p.get('category')}\n"
        content += f"DESCRIPTION: {p.get('description_live') or p.get('description_shadow', '')}\n"
        
        # Include technical specs
        specs = p.get('technical_specifications', {})
        if isinstance(specs, dict) and specs:
            content += "TECHNICAL SPECIFICATIONS:\n"
            for k, v in specs.items():
                content += f"- {k}: {v}\n"
        
        # Include clinical data from verbatim transcription
        verbatim = p.get('full_raw_transcription', '')
        if verbatim:
            content += f"CLINICAL DATA (VERBATIM):\n{verbatim}\n"
        
        # Features
        features = p.get('features_list', [])
        if features:
            content += "KEY FEATURES:\n" + "\n".join([f"- {f}" for f in features]) + "\n"
        
        doc = Document(
            page_content=content,
            metadata={
                "product_name": p.get('product_name'),
                "slug": p.get('slug'),
                "division": p.get('division'),
                "source": "catalog_json"
            }
        )
        documents.append(doc)

    print(f"Prepared {len(documents)} clinical documents. Updating Vector DB...")
    
    # Initialize Chroma and add documents
    vector_store = Chroma(
        collection_name="agile_healthcare",
        embedding_function=embeddings,
        persist_directory=DB_DIR
    )
    
    # Clear existing collection for a fresh start
    try:
        vector_store.delete_collection()
        vector_store = Chroma(
            collection_name="agile_healthcare",
            embedding_function=embeddings,
            persist_directory=DB_DIR
        )
    except:
        pass

    # Batch add (Chroma handles batching but we can do it explicitly for safety)
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        print(f"Indexing batch {i//batch_size + 1}/{(len(documents)//batch_size)+1}...")
        vector_store.add_documents(batch)

    print("Deep Indexing Complete.")

if __name__ == "__main__":
    deep_index()
