import os
from langchain_huggingface import HuggingFaceEmbeddings

print("🚀 Starting RAG Test...")
try:
    print("📥 Loading Embeddings Model...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    print("✅ Embeddings Loaded.")
    
    text = "Agile Healthcare is a Meril distributor."
    vector = embeddings.embed_query(text)
    print(f"✅ Embedding Test Successful. Vector size: {len(vector)}")
    
except Exception as e:
    print(f"❌ Error: {e}")
