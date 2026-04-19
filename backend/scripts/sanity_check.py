import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def main():
    api_key = os.environ.get("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    pdf_path = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/Trauma/Plating System/ARMAR_Palting Titanium/Trauma PLATE Brochure.pdf"
    
    print(f"Uploading {os.path.basename(pdf_path)}...")
    try:
        uploaded_file = client.files.upload(file=pdf_path)
        print(f"Upload successful: {uploaded_file.name}")
        
        print("Starting content generation...")
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp", # Using a known stable model
            contents=[
                uploaded_file,
                "List the top 5 orthopedic plates mentioned in this brochure."
            ]
        )
        
        print("\n[RESPONSE RECEIVED]")
        print(response.text)
        
        client.files.delete(name=uploaded_file.name)
        print("\nCleanup successful.")
        
    except Exception as e:
        print(f"\n[API ERROR]: {e}")

if __name__ == "__main__":
    asyncio.run(main())
