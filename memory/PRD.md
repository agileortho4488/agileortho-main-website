# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India ("Agile Ortho").
Core: 6-layer semantic architecture — Raw Extraction → Structured Catalog → Semantic Intelligence → Relationship Graph → Rule Engine → Website Generation.

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn UI, Manrope font
- Backend: FastAPI, Motor (Async MongoDB), Pydantic
- AI: Claude Sonnet 4.5 via emergentintegrations
- Storage: Emergent Object Storage
- Web Search: SerpAPI for product verification

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
- Products must be same semantic_implant_class OR same semantic_system_type to compare
- Different clinical classes blocked with clear error messages

### Phase 5F: Web-Search Fallback Pipeline — COMPLETE (2026-03-28)
**Goal:** Resolve 908 unenriched products using web search + LLM + rule-based inheritance.

**Pipeline Design:**
- SerpAPI for web evidence (4-tier source priority: Manufacturer > Regulatory > Authorized > General)
- Claude Sonnet 4.5 for structured semantic parsing
- Rule-based sibling inheritance for remaining products
- All results written to STAGED fields (proposed_*) — no canonical overwrites

**Execution:**
| Phase | Products | Method |
|-------|----------|--------|
| Dry-run | 50 | LLM + Web Search |
| Wave 1 | 150 | LLM + Web Search |
| Wave 2 | 300 | LLM + Web Search |
| Wave 3 (partial) | 274 | LLM + Web Search (budget exhausted) |
| Rule-based | 135 | Sibling inheritance + division defaults |
| **Total** | **909** | **100% coverage** |

**Results:**
- Total staged: 909 products
- Auto-promotable (conf ≥ 0.85, no conflict): 261 (29%)
- Needs review: 648 (71%)
- Average confidence: 0.82
- Verification logs: web_verification_log collection (909 entries)

**Staged fields written (proposed_* prefix):**
- proposed_clinical_display_title, proposed_clinical_subtitle
- proposed_semantic_brand_system, proposed_semantic_parent_brand
- proposed_semantic_system_type, proposed_semantic_implant_class
- proposed_semantic_material_default, proposed_semantic_coating_default
- proposed_semantic_anatomy_scope, proposed_semantic_procedure_scope
- proposed_semantic_family_group, proposed_semantic_use_case_tags
- proposed_semantic_confidence, proposed_semantic_review_required
- proposed_web_verification_status, proposed_recommended_action
- proposed_conflict_detected, proposed_reasoning_summary

**Key Scripts:**
- `/app/backend/scripts/web_search_fallback.py` — Main pipeline (dry-run, wave, promote modes)
- `/app/backend/scripts/rule_based_remaining.py` — Sibling inheritance for budget-limited products
- `/app/backend/scripts/dryrun_report.json` — Dry-run analysis

### Test Results
- iteration_37-40: Phases 5A-D — all 100%
- iteration_41: Phase 5E — 100% (17/17 backend, 100% frontend)

## Priority Stack
1. ~~Phase 5A-E~~ DONE
2. ~~Phase 5F: Web-Search Fallback~~ DONE (100% coverage, staged)
3. **NEXT: Promotion of accepted staged fields** — User approval needed
4. Non-pilot division shared-SKU cleanup (ENT, Endo Surgery)
5. Live DB push (ON HOLD)
6. WhatsApp bot (ON HOLD — needs Interakt API key)

## Key API Endpoints
- GET /api/catalog/divisions
- GET /api/catalog/divisions/{slug}
- GET /api/catalog/products/{slug}
- GET /api/catalog/products/{slug}/related
- POST /api/catalog/compare
- GET /api/catalog/compare/suggestions/{slug}
- GET /api/catalog/brand-intelligence/{entity_code}

## Key DB Collections
- catalog_products (1206 docs — 298 canonical + 909 staged)
- catalog_skus (5882 docs)
- brand_system_intelligence, family_relationships, semantic_rules
- web_verification_log (909 docs — per-product verification audit trail)

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw

## Known Issues
- File 008 (corrupted DOCX) — BLOCKED, awaiting replacement
- Emergent LLM Key budget exhausted — 135 products used rule-based fallback instead of LLM
