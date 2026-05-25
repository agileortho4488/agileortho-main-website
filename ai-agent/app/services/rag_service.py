import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

class RAGService:
    def __init__(self):
        self.client = None
        self.catalog_data = None
        self.memory = {}
        self.catalog_path = "repo/frontend/src/data/catalog_products.json"
        
    def initialize(self):
        print("Initializing Context-Injected RAG Service...")
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("WARNING: GOOGLE_API_KEY is not set.")
            return

        self.client = genai.Client(api_key=api_key)
        
        if os.path.exists(self.catalog_path):
            with open(self.catalog_path, 'r') as f:
                self.catalog_data = json.load(f)
        print(f"RAG Service Initialized with {len(self.catalog_data) if self.catalog_data else 0} products.")

    def chat(self, user_message: str, session_id: str) -> str:
        if not self.client:
            return "AI Service not initialized."

        import re
        # Perform a fast keyword-based retrieval to select relevant products
        stop_words = {"the", "what", "are", "you", "have", "for", "and", "with", "this", "that", "from", "your", "does", "have", "please", "show", "tell", "info", "find", "search", "list", "about", "product", "products", "device", "devices", "need", "give", "help", "its", "our", "their"}
        
        # Clean query: lowercase and keep alphanumeric characters
        cleaned_msg = "".join(c if c.isalnum() or c.isspace() else " " for c in user_message.lower())
        query_words = [w for w in cleaned_msg.split() if len(w) >= 3 and w not in stop_words]
        
        top_matches = []
        if query_words and self.catalog_data:
            matches = []
            for p in self.catalog_data:
                score = 0
                name = (p.get("product_name") or "").lower()
                name_display = (p.get("product_name_display") or "").lower()
                specs = str(p.get("technical_specifications") or "").lower()
                verbatim = str(p.get("full_raw_transcription") or "").lower()
                features = str(p.get("features_list") or "").lower()
                division = str(p.get("division") or "").lower()
                div_canonical = str(p.get("division_canonical") or "").lower()
                category = str(p.get("category") or "").lower()
                
                for word in query_words:
                    pattern = re.compile(rf'\b{re.escape(word)}\b')
                    if pattern.search(name) or pattern.search(name_display):
                        score += 15
                    if pattern.search(category):
                        score += 8
                    if pattern.search(division) or pattern.search(div_canonical):
                        score += 5
                    if pattern.search(features):
                        score += 3
                    if pattern.search(specs):
                        score += 2
                    if pattern.search(verbatim):
                        score += 1
                
                if score > 0:
                    matches.append((score, p))
            
            matches.sort(key=lambda x: x[0], reverse=True)
            top_matches = [m[1] for m in matches[:5]]

        # If no specific matches, default to top 3 generic products or empty
        if not top_matches and self.catalog_data:
            # We will use an empty list so LLM knows we don't have catalog data matching the query,
            # but let's provide a tiny default slice or category-based fallback if possible.
            pass

        # Select top matches and keep only key fields to present to LLM
        filtered_matches = []
        for p in top_matches:
            filtered_matches.append({
                "product_name": p.get("product_name_display") or p.get("product_name"),
                "sku_code": p.get("sku_code"),
                "division": p.get("division_canonical") or p.get("division"),
                "category": p.get("category"),
                "material": p.get("materials_canonical") or p.get("material_canonical"),
                "specs": p.get("technical_specifications"),
                "features": p.get("features_list"),
                "verbatim": p.get("full_raw_transcription")
            })
        
        # Compile the context from the filtered list of matches
        context = json.dumps(filtered_matches, indent=2)
        
        system_prompt = (
            "You are the **Lead Clinical Consultant for Agile Ortho**, a premier Meril Authorized Distributor in Telangana. "
            "You have access to the COMPLETE technical catalog for our entire portfolio.\n\n"
            "**CORE OPERATING RULES:**\n"
            "1. **Clinical Accuracy**: Provide exact technical data, sizing, and specs from the catalog. DO NOT hallucinate specs.\n"
            "2. **The 'Local' Authority**: State that Agile Ortho is the authorized partner for Meril in Telangana and provides 2-hour emergency dispatch in Hyderabad.\n"
            "3. **Consultative Expert**: Maintain a high-end, expert tone for surgeons and hospital administrators.\n"
            "4. **Direct Response**: Provide technical specs immediately. If you don't find a product, suggest the closest alternative from the same division.\n\n"
            f"**LIVE CATALOG DATA (RELEVANT PRODUCTS JSON):**\n{context}"
        )
        
        try:
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    types.Content(role="user", parts=[types.Part.from_text(text=user_message)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.1
                )
            )
            return response.text
        except Exception as e:
            print(f"Error in RAG chat: {e}")
            return "I apologize, but I am experiencing a temporary technical difficulty retrieving the clinical data. Please call our sales hotline at +917416216262 for immediate support."

    def index_url(self, url: str):
        print(f"Indexing URL: {url} is not supported in Context-Injected RAG mode.")

    def index_pdf(self, file_path: str):
        print(f"Indexing PDF: {file_path} is not supported in Context-Injected RAG mode.")
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Failed to delete temp file {file_path}: {e}")

rag_service = RAGService()
