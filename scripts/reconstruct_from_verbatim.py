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

async def extract_structured_data(product_name, verbatim_text):
    prompt = f"""
    ACT AS A CLINICAL DATA ENGINEER. 
    Below is a VERBATIM transcription from a medical brochure. 
    EXTRACT the structured technical data for the product: {product_name}.
    
    RETURN ONLY A JSON OBJECT with these fields:
    - technical_specifications: (object with label:value pairs)
    - clinical_indications: (list of strings)
    - clinical_benefits: (list of strings)
    - sizing_logic: (object with 'metric' and 'options' list with 'min', 'max', 'size')
    - materials_canonical: (string)
    - features_list: (list of strings)

    If data for a field is not found, return null for that field.
    BE PRECISE. Keep technical values exactly as they appear in the transcription.
    
    TRANSCRIPTION:
    {verbatim_text}
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
        print(f"Error extracting data for {product_name}: {e}")
        return None

async def main():
    if not os.path.exists(CATALOG_PATH):
        print(f"Error: {CATALOG_PATH} not found.")
        return

    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
    
    # Filter for products that have verbatim text but are missing structured technical matrices
    targets = [p for p in products if p.get('full_raw_transcription') and (
        not p.get('technical_specifications') or 
        len(p.get('technical_specifications', {})) == 0
    )]
    
    print(f"Found {len(targets)} products to reconstruct from verbatim source.")
    
    for i, p in enumerate(targets):
        name = p.get('product_name')
        print(f"[{i+1}/{len(targets)}] Reconstructing: {name}")
        
        extracted = await extract_structured_data(name, p['full_raw_transcription'])
        
        if extracted:
            # Handle case where Gemini returns a list or a nested object
            if isinstance(extracted, list) and len(extracted) > 0:
                extracted = extracted[0]
            
            if not isinstance(extracted, dict):
                print(f"Warning: Unexpected response format for {name}")
                continue

            if extracted.get('technical_specifications'):
                p['technical_specifications'] = extracted['technical_specifications']
            if extracted.get('clinical_indications'):
                p['clinical_indications'] = extracted['clinical_indications']
            if extracted.get('clinical_benefits'):
                p['clinical_benefits'] = extracted['clinical_benefits']
            if extracted.get('sizing_logic'):
                p['sizing_logic'] = extracted['sizing_logic']
            if extracted.get('materials_canonical'):
                p['materials_canonical'] = extracted['materials_canonical']
            if extracted.get('features_list') and not p.get('features_list'):
                p['features_list'] = extracted['features_list']
            
            p['enriched_from_verbatim'] = True
            p['brochure_intelligence_updated'] = True

        # Batch save every 5 products
        if (i + 1) % 5 == 0:
            with open(CATALOG_PATH, 'w') as f:
                json.dump(products, f, indent=2)
            print(f"--- Progress Saved ({i+1} products) ---")
            await asyncio.sleep(1)

    with open(CATALOG_PATH, 'w') as f:
        json.dump(products, f, indent=2)
    
    print("\nReconstruction from verbatim complete.")

if __name__ == "__main__":
    asyncio.run(main())
