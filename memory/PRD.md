# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India ("Agile Ortho").
Core: 6-layer semantic architecture — Raw Extraction → Structured Catalog → Semantic Intelligence → Relationship Graph → Rule Engine → Website Generation.

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn UI, Manrope font
- Backend: FastAPI, Motor (Async MongoDB), Pydantic
- AI: Claude Sonnet 4.5 via emergentintegrations
- Storage: Emergent Object Storage

## Completed Phases

### Phases 1-4: Pipeline → Chatbot → Taxonomy → Product Template — COMPLETE
- 1206 catalog_products, 5882 catalog_skus, 4 pilot divisions

### Phase 5A: Semantic Intelligence + Clinical Reclassification — COMPLETE (2026-03-27)
- 3 MongoDB collections: brand_system_intelligence, family_relationships, semantic_rules
- 297/1206 products enriched, clinical-first naming by division

### Phase 5B: Relationship Graph + Related Products — COMPLETE (2026-03-27)
- 3 labeled buckets: Compatible Components, Same Family Alternatives, Related System Products
- Admin password secured

### Phase 5C: Split Shared-SKU Products — COMPLETE (2026-03-28)
- 6 pools resolved, 1,296 SKUs reassigned, 27 products merged

### Phase 5D: Product Comparison — COMPLETE (2026-03-28)
- Side-by-side comparison of 2-4 products with clinical guardrails
- Suggestions endpoint, "Compare with Similar" button

### Phase 5E: Comparison QA + Clinical Guardrails — COMPLETE (2026-03-28)

**Clinical-Level Guardrails:**
- Products must be same `semantic_implant_class` OR same `semantic_system_type` to compare
- Different clinical classes blocked with clear error messages
- Cross-division comparison blocked

**QA Results (9 test pairs):**
| Pair | Expected | Actual | Result |
|------|----------|--------|--------|
| ARMAR plate vs AURIC plate | Pass (same plates) | Pass, high conf | ✓ |
| PFRN vs Elastic Nail | Pass (same nails) | Pass, high conf | ✓ |
| BioMime vs NexGen | Pass (same stents) | Pass, high conf | ✓ |
| HIV Test vs Dengue Test | Pass (same rapid tests) | Pass, high conf | ✓ |
| Albumin vs ALAT Reagent | Pass (same reagents) | Pass, high conf | ✓ |
| Plate vs Screw | Block (different class) | Blocked | ✓ |
| Cross-division | Block | Blocked | ✓ |
| Screw vs Nail | Block (component vs implant) | Blocked | ✓ |
| Reagent vs Rapid Test | Block (different class) | Blocked | ✓ |

**Response Fields:**
- `comparison_basis`: same_clinical_class, same_system_type, same_category, same_division_only
- `comparison_confidence`: high, medium, low
- `comparison_guardrail_reason`: Human-readable explanation

### Test Results
- iteration_37-40: Phases 5A-D — all 100%
- iteration_41: Phase 5E — 100% (17/17 backend, 100% frontend)

## Priority Stack
1. ~~Phase 5A-E~~ DONE
2. Non-pilot division shared-SKU cleanup (ENT, Endo Surgery)
3. Live DB push (ON HOLD)
4. WhatsApp bot (ON HOLD — needs Interakt API key)

## Key API Endpoints
- GET /api/catalog/divisions
- GET /api/catalog/divisions/{slug}
- GET /api/catalog/products/{slug}
- GET /api/catalog/products/{slug}/related
- POST /api/catalog/compare
- GET /api/catalog/compare/suggestions/{slug}
- GET /api/catalog/brand-intelligence/{entity_code}

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw
