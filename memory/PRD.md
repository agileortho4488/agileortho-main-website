# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India ("Agile Ortho").
Core requirement: "SKU Intelligence System" — extract 100% of product data from 200 manufacturer brochures. 6-layer architecture: Raw Extraction → Structured Catalog → Semantic Intelligence → Relationship Graph → Rule Engine → Website Generation.

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API (pending)

## Completed Phases

### Phases 1-4: Pipeline, Chatbot, Taxonomy, Product Template — COMPLETE
- 1206 catalog_products, 5882 catalog_skus, 4 pilot divisions

### Phase 5A: Semantic Intelligence + Clinical Reclassification — COMPLETE (2026-03-27)
- 3 MongoDB collections: `brand_system_intelligence`, `family_relationships`, `semantic_rules`
- 297/1206 products semantically enriched
- Product names reclassified: brand-centric → clinical-centric
- Naming rules by division (anatomy+implant for Trauma, device+function for CV, test+analyte for Diagnostics)

### Phase 5B: Relationship Graph + Related Products — COMPLETE (2026-03-27)
- `GET /api/catalog/products/{slug}/related` — 3 labeled buckets
- Compatible Components, Same Family Alternatives, Related System Products
- Only high-confidence data shown, empty for unenriched products
- Admin password secured (moved to .env)

### Phase 5C: Split Shared-SKU Products — COMPLETE (2026-03-28)

**Pools Resolved:**
| Pool | Action | Before | After |
|------|--------|--------|-------|
| DOA Diagnostics | Split by SKU code pattern | 7 products × 80 shared SKUs | Individual: AMP=28, COC=14, MOR=12, OPI=12, THC=75, Single=179, Multi=243 |
| AutoQuant Reagents | Split by code prefix | 3 products × 50 shared | CRP=3, Lipase/Albumin distributed |
| PFRN Nails | Split by nail type pattern | 3 products × 59 shared | PFRN=59, Reconstruction=14, Generic IM=59 |
| PFRN Locking Bolts | Merged 27 size products | 27 individual bolt sizes → 1 parent | "Locking Bolts 4.9mm" with all bolt SKUs |
| Humerus Plates | Merged 5 duplicates | 5 duplicate products | 1 consolidated with 34 SKUs |
| Proviso Test Kits | Split by test type | 4 products × 15 shared | Individual test kits |

**Other Fixes:**
- MBOSS screw products promoted to `mapping_confidence: "high"` — now appear as Compatible Components
- 1,296 total SKUs reassigned
- 27 products merged (bolt sizes → parent family)
- 6 shared-SKU pools resolved

**Remaining Shared-SKU Issues (non-pilot divisions):**
- ENT: Tracheostomy tubes (24 SKUs × 3 products), MESIRE balloons (19 SKUs × 10 products), T-Tubes (6 SKUs × 7 products)
- Endo Surgery: Endocutters (8 SKUs × 8 products), Power Endocutters (8 SKUs × 8 products), Trocars (7 SKUs × 6 products)
- Cardiovascular: Flomero (12 SKUs × 3 products)

### Test Results
- iteration_37: Phase 5A — 100%
- iteration_38: Phase 5B — 100%
- iteration_39: Phase 5C — 100% (14/14 backend, 100% frontend)

## Current Priority Stack
1. ~~Phase 5A-C~~ DONE
2. **Phase 5D: Product Comparison Feature** (using semantic attributes)
3. **Phase 5E: Re-audit vague/mixed pages** (using semantic rules)
4. Non-pilot division shared-SKU cleanup (ENT, Endo Surgery)
5. Live DB push (ON HOLD)
6. WhatsApp bot (ON HOLD — needs Interakt API key)

## Key API Endpoints
- `GET /api/catalog/divisions` — all divisions with product counts
- `GET /api/catalog/divisions/{slug}` — division detail with products
- `GET /api/catalog/products/{slug}` — product detail with SKUs
- `GET /api/catalog/products/{slug}/related` — relationship-based related products
- `GET /api/catalog/brand-intelligence/{entity_code}` — semantic brand lookup

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw
