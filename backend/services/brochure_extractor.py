import os
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, ConfigDict
from google import genai
from google.genai import types
from rapidfuzz import fuzz

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
JSON_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/seed_data/catalog_products.json"

# Pydantic models for structured output
class TechSpec(BaseModel):
    label: str = Field(description="The name of the tech spec, e.g., 'Material' or 'Length'")
    value: str = Field(description="The value of the tech spec, e.g., 'Stainless Steel' or '150mm'")

class ProductSpecs(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    product_name: str = Field(description="The primary name of the medical product/system")
    brand_name: Optional[str] = Field(description="The brand under which the product is marketed (e.g. BioMime, Destiknee)")
    division: str = Field(description="Medical division (e.g. Cardiovascular, Orthopedics, Endosurgery)")
    category: str = Field(description="Device category (e.g. Coronary Stents, Knee Implants)")
    description: str = Field(description="A 2-3 sentence clinical summary of the product's purpose and benefits")
    technical_specifications: List[TechSpec] = Field(description="Key technical data points as a list of label/value pairs")
    clinical_indications: List[str] = Field(description="Medical conditions this device is used to treat")
    materials: List[str] = Field(description="Primary materials used in the device (e.g. Cobalt Chromium, PLLA, Stainless Steel)")
    key_features: List[str] = Field(description="Bullet points of high-value product features")

class BrochureExtractor:
    def __init__(self):
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemini-flash-latest"

    async def extract_pdf_data(self, pdf_path: str) -> Optional[ProductSpecs]:
        """Uploads PDF to Gemini and extracts structured JSON."""
        file_name = os.path.basename(pdf_path)
        logger.info(f"Uploading {file_name} to Gemini File API...")

        try:
            # Upload file
            uploaded_file = self.client.files.upload(file=pdf_path)
            
            prompt = """
            Analyze this medical brochure PDF and extract the technical information into the specified JSON format.
            Focus on accuracy for technical specifications (sizes, materials, pressures, etc.).
            If there are multiple products in one brochure, extract the primary one or the comprehensive system specs.
            """

            # Definition for structured output (as a dict to avoid SDK conversion bugs)
            response_schema = {
                "type": "OBJECT",
                "properties": {
                    "product_name": {"type": "STRING"},
                    "brand_name": {"type": "STRING"},
                    "division": {"type": "STRING"},
                    "category": {"type": "STRING"},
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
                    "key_features": {"type": "ARRAY", "items": {"type": "STRING"}}
                },
                "required": ["product_name", "division", "category", "description", "technical_specifications", "clinical_indications", "materials", "key_features"]
            }

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=[
                    uploaded_file,
                    prompt
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=response_schema,
                ),
            )

            # Cleanup file from Gemini's server
            self.client.files.delete(name=uploaded_file.name)

            if response.text:
                parsed_json = json.loads(response.text)
                return ProductSpecs(**parsed_json)
            return None

        except Exception as e:
            logger.error(f"Error extracting data from {file_name}: {e}")
            return None

    def _load_catalog(self) -> List[Dict]:
        if os.path.exists(JSON_PATH):
            with open(JSON_PATH, 'r') as f:
                return json.load(f)
        return []

    def _save_catalog(self, catalog: List[Dict]):
        # Save atomically using a temp file
        temp_path = JSON_PATH + ".tmp"
        with open(temp_path, 'w') as f:
            json.dump(catalog, f, indent=2)
        os.replace(temp_path, JSON_PATH)

    async def match_and_update_json(self, extracted_data: ProductSpecs):
        """Matches extracted product name to JSON catalog and updates."""
        catalog = self._load_catalog()
        
        best_match_idx = -1
        best_score = 0

        # Fuzzy match product name
        for idx, p in enumerate(catalog):
            score = fuzz.token_sort_ratio(extracted_data.product_name.lower(), p.get("product_name", "").lower())
            if score > best_score:
                best_score = score
                best_match_idx = idx

        # If match score is high enough, update
        if best_match_idx != -1 and best_score > 75:
            matched_product = catalog[best_match_idx]
            logger.info(f"Matched '{extracted_data.product_name}' to '{matched_product['product_name']}' (Score: {best_score})")
            
            # Convert TechSpec list to Dict for DB storage
            tech_dict = {item.label: item.value for item in extracted_data.technical_specifications}

            matched_product["technical_specifications"] = tech_dict
            matched_product["description_shadow"] = extracted_data.description
            matched_product["clinical_indications"] = extracted_data.clinical_indications
            matched_product["materials_canonical"] = extracted_data.materials[0] if extracted_data.materials else None
            matched_product["features_list"] = extracted_data.key_features
            matched_product["brochure_intelligence_updated"] = True
            
            self._save_catalog(catalog)
            return True
        else:
            logger.warning(f"No strong match found for '{extracted_data.product_name}' (Best: {best_score})")
            return False

extractor = BrochureExtractor()
