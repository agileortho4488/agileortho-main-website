import json
import os
import asyncio
from google import genai
from google.genai import types

# Constants
CATALOG_PATH = 'repo/frontend/src/data/catalog_products.json'
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

client = genai.Client(api_key=GOOGLE_API_KEY)

async def clip_transcription(product_name, full_text):
    prompt = f"""
    You are a clinical data editor. 
    Below is a long verbatim transcription from a corporate brochure that covers MULTIPLE different product divisions (Dental, ENT, Ortho, etc.).
    
    TARGET PRODUCT: {product_name}
    
    TASK: Extract ONLY the text, tables, and data points from the transcription that are directly relevant to {product_name}. 
    - Keep the technical details intact.
    - Remove sections about unrelated products (e.g., if the target is a Knee implant, remove Dental or ENT sections).
    - If the product is only mentioned in a list, keep that context.
    - Return ONLY the relevant text. No preamble.
    
    TRANSCRIPTION:
    {full_text}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error clipping {product_name}: {e}")
        return full_text

async def main():
    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
    
    # Identify products needing clipping (Large transcriptions with broad headers)
    targets = []
    for p in products:
        text = p.get('full_raw_transcription', '')
        # Simple heuristic: If it has "DENTAL SOLUTIONS" but isn't dental
        if 'DENTAL SOLUTIONS' in text and 'Dental' not in p.get('category', ''):
            targets.append(p)
        elif len(text) > 5000: # Very large corporate files
            targets.append(p)
            
    print(f"Found {len(targets)} products needing transcription refinement.")
    
    count = 0
    for p in targets:
        name = p.get('product_name')
        print(f"[{count+1}/{len(targets)}] Clipping transcription for: {name}")
        
        refined_text = await clip_transcription(name, p['full_raw_transcription'])
        p['full_raw_transcription'] = refined_text
        p['transcription_refined'] = True
        
        count += 1
        # Rate limit safety
        if count % 10 == 0:
            with open(CATALOG_PATH, 'w') as f:
                json.dump(products, f, indent=2)
            print("--- Progress Saved ---")
            await asyncio.sleep(2)

    with open(CATALOG_PATH, 'w') as f:
        json.dump(products, f, indent=2)
    
    print(f"\nSuccessfully refined {count} product transcriptions.")

if __name__ == "__main__":
    asyncio.run(main())
