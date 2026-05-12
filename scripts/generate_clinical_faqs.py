import json
import os
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Constants
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(os.path.dirname(ROOT_DIR), '.env'))

CATALOG_PATH = os.path.join(ROOT_DIR, 'frontend/src/data/catalog_products.json')
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

client = genai.Client(api_key=GOOGLE_API_KEY)

async def generate_faqs(product_name, specs):
    specs_str = json.dumps(specs, indent=2)
    prompt = f"""
    ACT AS A CLINICAL SPECIALIST. 
    Based on the technical specifications below for the product "{product_name}", generate 3 unique, professional Frequently Asked Questions (FAQs).
    
    The FAQs should focus on:
    1. Clinical performance/precision.
    2. Material/biocompatibility or technical advantage.
    3. Operational/Surgical benefit.

    RETURN ONLY A JSON LIST of objects with "question" and "answer" fields.
    BE CONCISE but technical.
    
    SPECIFICATIONS:
    {specs_str}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error generating FAQs for {product_name}: {e}")
        return None

async def main():
    if not os.path.exists(CATALOG_PATH):
        print(f"Error: {CATALOG_PATH} not found.")
        return

    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
    
    # Priority divisions for commercial impact
    PRIORITY_DIVISIONS = ["Cardiovascular", "Joint Replacement", "Diagnostics", "Robotics", "ENT", "Urology"]
    
    # Filter for products that have technical specs but no unique FAQs yet
    targets = [p for p in products if p.get('technical_specifications') and not p.get('clinical_faqs')]
    
    # Sort to put priority divisions first
    targets.sort(key=lambda p: 0 if p.get('division_canonical') in PRIORITY_DIVISIONS else 1)
    
    # Limit to 100 products per run to manage time and rate limits
    targets = targets[:100]
    
    print(f"Found {len(targets)} priority products to generate clinical FAQs for.")
    
    for i, p in enumerate(targets):
        name = p.get('product_name')
        print(f"[{i+1}/{len(targets)}] Generating FAQs for: {name}")
        
        faqs = await generate_faqs(name, p['technical_specifications'])
        
        if faqs and isinstance(faqs, list):
            p['clinical_faqs'] = faqs
            p['seo_faq_generated'] = True

        # Batch save every 10 products
        if (i + 1) % 10 == 0:
            with open(CATALOG_PATH, 'w') as f:
                json.dump(products, f, indent=2)
            print(f"--- Progress Saved ({i+1} products) ---")
            await asyncio.sleep(1)

    with open(CATALOG_PATH, 'w') as f:
        json.dump(products, f, indent=2)
    
    print("\nClinical FAQ generation complete.")

if __name__ == "__main__":
    asyncio.run(main())
