import os
import json
import logging
import asyncio
import base64
import fitz # PyMuPDF
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, ConfigDict
from google import genai
from google.genai import types
from rapidfuzz import fuzz
import litellm

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
JSON_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/frontend/src/data/catalog_products.json"

# Pydantic models for structured output
class TechSpec(BaseModel):
    label: str = Field(description="The name of the tech spec, e.g., 'Material' or 'Length'")
    value: str = Field(description="The value of the tech spec, e.g., 'Stainless Steel' or '150mm'")

class SizingOption(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    size: str

class SizingLogic(BaseModel):
    metric: Optional[str] = None
    options: Optional[List[SizingOption]] = None

class ProductSpecs(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    product_name: str = Field(description="The primary name of the medical product/system (e.g. ARMAR Plating System)")
    brand_name: Optional[str] = Field(description="The brand under which the product is marketed (e.g. BioMime, Destiknee)")
    division: str = Field(description="Medical division (e.g. Cardiovascular, Orthopedics, Endosurgery)")
    category: str = Field(description="Device category (e.g. Coronary Stents, Knee Implants)")
    catalog_matches: List[str] = Field(description="List of specific product names from the catalog that this brochure covers (e.g. ['Proximal Humerus Plate', 'Distal Radius Plate'])")
    description: str = Field(description="A 2-3 sentence clinical summary of the product's purpose and benefits")
    technical_specifications: List[TechSpec] = Field(description="Key technical data points as a list of label/value pairs")
    clinical_indications: List[str] = Field(description="Medical conditions this device is used to treat")
    materials: List[str] = Field(description="Primary materials used in the device (e.g. Cobalt Chromium, PLLA, Stainless Steel)")
    key_features: List[str] = Field(description="Bullet points of high-value product features")
    sizing_logic: Optional[SizingLogic] = Field(default=None, description="Structured sizing rules for the anatomical wizard")

class BrochureExtractor:
    def __init__(self, provider: str = "gemini"):
        self.provider = provider
        self.google_key = os.environ.get("GOOGLE_API_KEY")
        self.openai_key = os.environ.get("OPENAI_API_KEY")
        self.anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
        
        # Configure LiteLLM keys
        if self.openai_key: os.environ["OPENAI_API_KEY"] = self.openai_key
        if self.anthropic_key: os.environ["ANTHROPIC_API_KEY"] = self.anthropic_key
        
        if self.google_key:
            self.gemini_client = genai.Client(api_key=self.google_key)
        
        self.model_id = "gemini-2.0-flash" if provider == "gemini" else "claude-3-5-sonnet-20241022"

    def _pdf_to_base64_images(self, pdf_path: str, max_pages: int = 5) -> List[str]:
        """Converts PDF pages to base64 encoded JPEG images for vision models."""
        images = []
        try:
            doc = fitz.open(pdf_path)
            for i in range(min(len(doc), max_pages)):
                page = doc.load_page(i)
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # Higher resolution
                img_data = pix.tobytes("jpeg")
                images.append(base64.b64encode(img_data).decode("utf-8"))
            doc.close()
        except Exception as e:
            logger.error(f"Error converting PDF to images: {e}")
        return images

    async def extract_pdf_data(self, pdf_path: str, target_products: Optional[List[str]] = None) -> Optional[ProductSpecs]:
        """Extracts structured JSON from PDF using the active provider with auto-fallback."""
        try:
            if self.provider == "gemini":
                return await self._extract_gemini(pdf_path, target_products)
            else:
                return await self._extract_litellm(pdf_path, target_products)
        except Exception as e:
            error_msg = str(e).encode('utf-8', 'ignore').decode('utf-8')
            logger.warning(f"Primary provider {self.provider} failed: {error_msg}")
            if self.provider == "gemini" and (self.openai_key or self.anthropic_key):
                logger.info("Falling back to LiteLLM (Claude/GPT)...")
                return await self._extract_litellm(pdf_path, target_products)
            raise e

    async def _extract_gemini(self, pdf_path: str, target_products: Optional[List[str]] = None) -> Optional[ProductSpecs]:
        """Native Gemini File API extraction with auto-fallback to Vision for large files."""
        file_name = os.path.basename(pdf_path)
        target_context = ""
        if target_products:
            target_context = f"\nPRIORITIZE EXTRACTING DATA FOR THESE SPECIFIC PRODUCTS: {', '.join(target_products)}\n"

        prompt = f"""
        ACT AS A TOP-TIER SURGICAL CLINICAL ENGINEER. 
        Analyze this medical brochure and perform a DEEP SCAN extraction of the FULL TECHNICAL MATRIX.{target_context}
        
        1. EXTRACT FULL SIZE TABLES: Capture EVERY variant including Part Numbers, Lengths (mm), Widths (mm), and Hole Counts.
        2. BLUEPRINT FIDELITY: If the brochure has a sizing table, replicate its structure exactly. Do not summarize.
        3. MATERIAL CODES: Identify exact alloys (e.g., ASTM F138 Stainless Steel, Ti6Al4V ELI Titanium).
        
        Return the technical specifications as a list of label/value pairs. Join related values into a single string for 'value'.
        """

        response_schema = {
            "type": "OBJECT",
            "properties": {
                "product_name": {"type": "STRING"},
                "brand_name": {"type": "STRING"},
                "division": {"type": "STRING"},
                "category": {"type": "STRING"},
                "catalog_matches": {"type": "ARRAY", "items": {"type": "STRING"}},
                "description": {"type": "STRING"},
                "technical_specifications": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "label": {"type": "STRING"},
                            "value": {"type": "STRING"}
                        },
                    }
                },
                "clinical_indications": {"type": "ARRAY", "items": {"type": "STRING"}},
                "materials": {"type": "ARRAY", "items": {"type": "STRING"}},
                "key_features": {"type": "ARRAY", "items": {"type": "STRING"}},
                "sizing_logic": {
                    "type": "OBJECT",
                    "properties": {
                        "metric": {"type": "STRING"},
                        "options": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "min": {"type": "NUMBER"},
                                    "max": {"type": "NUMBER"},
                                    "size": {"type": "STRING"}
                                }
                            }
                        }
                    }
                }
            },
            "required": ["product_name", "division", "category", "catalog_matches", "description", "technical_specifications", "clinical_indications", "materials", "key_features"]
        }

        try:
            # Attempt File API first
            safe_display_name = file_name.encode('ascii', 'ignore').decode('ascii')
            uploaded_file = self.gemini_client.files.upload(
                file=pdf_path,
                config=types.UploadFileConfig(display_name=safe_display_name)
            )
            response = self.gemini_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[uploaded_file, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=response_schema,
                ),
            )
            self.gemini_client.files.delete(name=uploaded_file.name)
            return ProductSpecs(**json.loads(response.text))
            
        except Exception as e:
            if "INVALID_ARGUMENT" in str(e) or "too large" in str(e).lower():
                logger.info(f"File {file_name} too large for File API. Falling back to Vision extraction...")
                images = self._pdf_to_base64_images(pdf_path, max_pages=10) # Process more pages for large docs
                if not images: raise e
                
                # Convert base64 to parts for Gemini
                image_parts = [{"inline_data": {"mime_type": "image/jpeg", "data": img}} for img in images]
                
                response = self.gemini_client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=[prompt, *image_parts],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=response_schema,
                    ),
                )
                return ProductSpecs(**json.loads(response.text))
            raise e

    async def _extract_litellm(self, pdf_path: str, target_products: Optional[List[str]] = None) -> Optional[ProductSpecs]:
        """LiteLLM (Claude/GPT) vision-based extraction."""
        images = self._pdf_to_base64_images(pdf_path)
        if not images: return None
        
        model = "anthropic/claude-3-5-sonnet-20241022" if self.anthropic_key else "openai/gpt-4o-mini"
        logger.info(f"Using LiteLLM with {model}")
        
        target_context = f"\nSpecific targets: {', '.join(target_products)}" if target_products else ""
        
        messages = [
            {"role": "system", "content": "You are a clinical data extractor. Output ONLY valid JSON matching the schema provided."},
            {"role": "user", "content": [
                {"type": "text", "text": f"Extract clinical data from these brochure pages.{target_context}\nReturn JSON exactly matching the ProductSpecs Pydantic model."},
                *[{"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img}"}} for img in images]
            ]}
        ]

        response = await litellm.acompletion(
            model=model,
            messages=messages,
            response_format={"type": "json_object"}
        )
        
        raw_json = response.choices[0].message.content
        return ProductSpecs(**json.loads(raw_json))

    def _load_catalog(self) -> List[Dict]:
        if os.path.exists(JSON_PATH):
            with open(JSON_PATH, 'r') as f:
                return json.load(f)
        return []

    def _save_catalog(self, catalog: List[Dict]):
        temp_path = JSON_PATH + ".tmp"
        with open(temp_path, 'w') as f:
            json.dump(catalog, f, indent=2)
        os.replace(temp_path, JSON_PATH)

    async def match_and_update_json(self, extracted_data: ProductSpecs):
        catalog = self._load_catalog()
        updated_count = 0
        targets = set(extracted_data.catalog_matches)
        targets.add(extracted_data.product_name)

        for p in catalog:
            is_match = False
            for target in targets:
                score = fuzz.token_sort_ratio(target.lower(), p.get("product_name", "").lower())
                if score > 85:
                    is_match = True
                    break
                
            if is_match:
                tech_dict = {item.label: item.value for item in extracted_data.technical_specifications}
                p["technical_specifications"] = tech_dict
                p["description_shadow"] = extracted_data.description
                p["clinical_indications"] = extracted_data.clinical_indications
                p["materials_canonical"] = extracted_data.materials[0] if extracted_data.materials else None
                p["features_list"] = extracted_data.key_features
                p["brochure_intelligence_updated"] = True
                if extracted_data.sizing_logic:
                    p["sizing_logic"] = extracted_data.sizing_logic.model_dump()
                updated_count += 1
        
        if updated_count > 0:
            self._save_catalog(catalog)
            return True
        return False

# Global instance removed to allow manual env loading before instantiation
