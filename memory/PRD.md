# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India ("Agile Ortho").
Core requirement: "SKU Intelligence System" — extract 100% of product data from 200 manufacturer brochures. 4-layer architecture feeding a Website Chatbot and WhatsApp AI Chatbot.

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API (pending)

## SKU Intelligence Pipeline — COMPLETE
- 523 raw products, 481 normalized, 5107 SKU codes, 97 brands, 13 divisions, 654 training chunks

## Website Chatbot UI — COMPLETE

## Catalog Taxonomy & Merge (Phase 1-4) — COMPLETE
- 1206 catalog_products, 5882 catalog_skus across 4 pilot divisions

## Phase 5A: Semantic Intelligence + Clinical Reclassification — COMPLETE (2026-03-27)
- 3 new MongoDB collections: `brand_system_intelligence`, `family_relationships`, `semantic_rules`
- 297/1206 products semantically enriched
- Product names reclassified: brand-centric → clinical-centric
- Brand info moved to `clinical_subtitle` field

## Phase 5B: Relationship Graph API + Related Products — COMPLETE (2026-03-27)

### API Endpoint
`GET /api/catalog/products/{slug}/related`

Response shape:
```json
{
  "compatible_components": [
    {"slug": "...", "product_name_display": "...", "clinical_subtitle": "...", "relationship_label": "Compatible Screw", ...}
  ],
  "same_family_alternatives": [
    {"slug": "...", "product_name_display": "...", "relationship_label": "Coated Variant Available", ...}
  ],
  "related_system_products": []
}
```

### Coverage Report
- **Products with high-confidence semantic data**: 288/1206
- **Products with at least one related product (high conf + PILOT_FILTER)**: ~70 (primarily ARMAR ↔ AURIC)
- **Products with empty related results**: 1136 (low confidence or no brand-level relationships)

### Examples from Each Bucket
| Bucket | Product | Related Items | Labels |
|--------|---------|--------------|--------|
| Compatible Components | (Pending MBOSS promotion to high conf) | — | Compatible Screw |
| Same Family Alternatives | ARMAR Titanium Plates | 7 AURIC plates | Coated Variant Available |
| Same Family Alternatives | AURIC Volar Plate | 1 ARMAR plate | Coated Variant |

### Low-confidence products show nothing
Products with `semantic_confidence < 0.85` or brands without relationships return:
```json
{"compatible_components": [], "same_family_alternatives": [], "related_system_products": []}
```

### Admin Password
- Changed from default `admin` to secure value
- Stored in `.env` as `ADMIN_PASSWORD` (not hardcoded)
- JWT_SECRET also rotated to secure random value

### Test Results
- iteration_37: Phase 5A — 100%
- iteration_38: Phase 5B — 100% backend, 95% frontend (data consistency fixed)

## Priority Stack
1. ~~Phase 5A: Semantic Intelligence + Clinical Reclassification~~ DONE
2. ~~Phase 5B: Relationship Graph + Related Products~~ DONE
3. **Phase 5C: Split shared-SKU products** (DOA diagnostics, reagents)
4. **Phase 5D: Product Comparison Feature**
5. **Phase 5E: Re-audit vague/mixed pages**
6. Live DB push (ON HOLD)
7. WhatsApp bot (ON HOLD — needs Interakt API key)

## Blocked
- File 008 (corrupted DOCX)
- WhatsApp bot (needs Interakt API key)
- MBOSS Compatible Components: MBOSS screws have `mapping_confidence: "medium"`, need promotion to "high" to appear in Related Products

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw
