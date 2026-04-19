import json
import os
import logging
import re
from typing import List, Dict, Any, Set, Optional
from collections import defaultdict

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
JSON_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/frontend/src/data/catalog_products.json"

class KnowledgeGraph:
    def __init__(self):
        self.catalog: List[Dict] = []
        # Index everything by normalized keywords for discovery
        self.keyword_index = defaultdict(set)
        self.load_graph()

    def load_graph(self):
        """Loads processed catalog and builds a multi-faceted keyword index."""
        if not os.path.exists(JSON_PATH):
            logger.warning(f"Catalog file not found at {JSON_PATH}")
            return

        try:
            with open(JSON_PATH, 'r') as f:
                self.catalog = json.load(f)
            
            for product in self.catalog:
                slug = product.get("slug", "")
                if not slug:
                    continue

                # Fields to index
                searchable_text = [
                    product.get("product_name", ""),
                    product.get("product_name_display", ""),
                    product.get("brand", ""),
                    product.get("division_canonical", ""),
                    product.get("category", ""),
                    product.get("materials_canonical", ""),
                    product.get("semantic_brand_system", ""),
                    product.get("semantic_system_type", ""),
                ]
                
                # Clinical indications
                indications = product.get("clinical_indications", [])
                if isinstance(indications, list):
                    searchable_text.extend(indications)

                # Process all text into individual keywords
                for text in searchable_text:
                    if text:
                        # Normalize and tokenize
                        words = re.findall(r'\b[a-zA-Z0-9]{3,}\b', str(text).lower())
                        for word in words:
                            self.keyword_index[word].add(slug)
                
            logger.info(f"Knowledge Graph built with {len(self.catalog)} products and {len(self.keyword_index)} searchable keywords.")

        except Exception as e:
            logger.error(f"Error building Knowledge Graph: {e}")

    def query(self, terms: List[str]) -> List[Dict]:
        """Queries the graph using a keyword intersection/union approach."""
        if not terms:
            return []

        matched_slugs = Counter()
        
        for term in terms:
            term = term.lower().strip()
            if not term:
                continue

            # Exact keyword match
            if term in self.keyword_index:
                for slug in self.keyword_index[term]:
                    matched_slugs[slug] += 2  # Higher weight for exact keyword match

            # Substring match (e.g. "mitr" matches "mitral")
            if len(term) >= 3:
                for kw in self.keyword_index.keys():
                    if term in kw:
                        for slug in self.keyword_index[kw]:
                            matched_slugs[slug] += 1

        # Sort by match score
        sorted_slugs = [s for s, count in matched_slugs.most_common(20)]
        results = []
        for slug in sorted_slugs:
            p = self._get_by_slug(slug)
            if p:
                results.append(p)

        return results

    def _get_by_slug(self, slug: str) -> Optional[Dict]:
        for p in self.catalog:
            if p.get("slug") == slug:
                return p
        return None

from collections import Counter
kg = KnowledgeGraph()
