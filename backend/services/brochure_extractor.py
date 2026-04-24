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
JSON_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/frontend/src/data/catalog_products.json"

# Pydantic models for structured output
class TechSpec(BaseModel):
    label: str = Field(description="The name of the tech spec, e.g., 'Material' or 'Length'")
    value: str = Field(description="The value of the tech spec, e.g., 'Stainless Steel' or '150mm'")

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
            ACT AS A TOP-TIER SURGICAL CLINICAL ENGINEER. 
            Analyze this medical brochure PDF and perform a DEEP SCAN extraction of the FULL TECHNICAL MATRIX.
            
            1. EXTRACT FULL SIZE TABLES: Capture EVERY variant including Part Numbers, Lengths (mm), Widths (mm), and Hole Counts.
            2. BLUEPRINT FIDELITY: If the brochure has a sizing table, replicate its structure exactly. Do not summarize.
            3. MATERIAL CODES: Identify exact alloys (e.g., ASTM F138 Stainless Steel, Ti6Al4V ELI Titanium).
            4. VISUAL STYLE: Note that the reconstruction will use a 'Cool Surgical Blue Blueprint' aesthetic.
            
            Return the technical specifications as a list of label/value pairs. If the data is inherently a multi-column table, join the related values into a single string for the 'value' field (e.g., label: 'Size 5 Holes', value: 'Part #1234, Length 80mm').
            """

            # Definition for structured output (as a dict to avoid SDK conversion bugs)
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
                    "key_features": {"type": "ARRAY", "items": {"type": "STRING"}}
                },
                "required": ["product_name", "division", "category", "catalog_matches", "description", "technical_specifications", "clinical_indications", "materials", "key_features"]
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
                # Clean markdown JSON if present
                clean_text = response.text
                if "```json" in clean_text:
                    clean_text = clean_text.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_text:
                    clean_text = clean_text.split("```")[1].split("```")[0].strip()
                
                try:
                    parsed_json = json.loads(clean_text)
                    return ProductSpecs(**parsed_json)
                except Exception as parse_error:
                    print(f"\n[PARSE ERROR] Raw Text: {response.text[:200]}...")
                    print(f"[PARSE ERROR] Details: {parse_error}")
                    raise parse_error
            return None

        except Exception as e:
            logger.error(f"Error extracting data from {file_name}: {e}", exc_info=True)
            raise e

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
        """Matches extracted data to catalog and updates multiple products if it's a 'System' brochure."""
        catalog = self._load_catalog()
        updated_count = 0

        # Create a set of targets to update
        # 1. Direct system match (if product_name is a system)
        # 2. Individual catalog matches listed by AI
        targets = set(extracted_data.catalog_matches)
        targets.add(extracted_data.product_name)

        for idx, p in enumerate(catalog):
            # Check for any high-confidence matches in the targets set
            is_match = False
            for target in targets:
                score = fuzz.token_sort_ratio(target.lower(), p.get("product_name", "").lower())
                if score > 85: # High threshold for systems
                    is_match = True
                    break
                
                # Also match by product_family if applicable
                family_score = fuzz.token_sort_ratio(extracted_data.product_name.lower(), p.get("product_family", "").lower())
                if family_score > 90:
                    is_match = True
                    break
                
                # NEW: Match by original_filename in images (often contains brochure name)
                for img in p.get("images", []):
                    img_name = img.get("original_filename", "").lower()
                    if target.lower() in img_name:
                        is_match = True
                        break
                if is_match: break

            if is_match:
                logger.info(f"Syncing brochure data to: {p['product_name']}")
                
                # Convert TechSpec list to Dict
                tech_dict = {item.label: item.value for item in extracted_data.technical_specifications}

                p["technical_specifications"] = tech_dict
                p["description_shadow"] = extracted_data.description
                p["clinical_indications"] = extracted_data.clinical_indications
                p["materials_canonical"] = extracted_data.materials[0] if extracted_data.materials else None
                p["features_list"] = extracted_data.key_features
                p["brochure_intelligence_updated"] = True
                updated_count += 1
        
        if updated_count > 0:
            self._save_catalog(catalog)
            return True
        else:
            logger.warning(f"No strong matches found for '{extracted_data.product_name}' or its components.")
            return False

extractor = BrochureExtractor()
