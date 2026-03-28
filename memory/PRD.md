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

### Phase 5A: Semantic Intelligence + Clinical Reclassification — COMPLETE
### Phase 5B: Relationship Graph + Related Products — COMPLETE
### Phase 5C: Split Shared-SKU Products — COMPLETE
### Phase 5D: Product Comparison — COMPLETE
### Phase 5E: Comparison QA + Clinical Guardrails — COMPLETE

### Phase 5F: Web-Search Fallback Pipeline — COMPLETE (2026-03-28)
- 774 products via LLM+SerpAPI, 135 via rule-based sibling inheritance
- 100% coverage (909 staged), 243 auto-promoted

### Phase 5G: Enrichment Review Dashboard — COMPLETE (2026-03-28)
- Product-level: filters, side-by-side comparison, approve/reject/edit+approve
- Family-level: bulk approve by family pattern
- Audit trail: promotion_log collection

### Phase 5H: Smart Review Suggestions — COMPLETE (2026-03-28)
- Analyzes families for bulk-approve safety with 8 eligibility criteria
- **Testing: 100% pass (59/59 backend + all frontend — iteration_43.json)**

### Phase 5I: Non-Pilot Shared-SKU Cleanup — COMPLETE (2026-03-28)
- ENT: 49→45 products (merged duplicates), 0 shared shadow_ids
- Endo Surgery: 170 products, 0 shared shadow_ids
- Cardiovascular: 66 products, 0 shared shadow_ids (Flomero sizers + BioMime stents)
- **Testing: 100% pass (23 backend + all frontend — iteration_44.json)**

### Phase 5J: 4-Lane Auto-Promotion Pipeline — COMPLETE (2026-03-28)
- Lane 1 (Safe): 245 products — conf>=0.85, no conflicts, not blocked status
- Lane 2 (Family Consensus): 2 products — clean families, same brand/class/materials
- Lane 3 (Inherit+Standalone): 258 products — parent inheritance, size variants, decent conf
- Lane 4 (Manual Review): 65 products — true blockers only
- Total promoted: 505 products in one execution
- **Testing: 100% pass (26 backend + all frontend — iteration_45.json)**

## Current State
| Metric | Value |
|--------|-------|
| Total products | 1,202 |
| Canonical enriched | 1,134 (94.3%) |
| Staged (pending) | 903 |
| Promoted total | 842 |
| Pending review | 66 |
| Manual review only | 65 |
| ENT products | 45 (0 shared) |
| Endo Surgery products | 170 (0 shared) |
| Cardiovascular products | 66 (0 shared) |

## Key API Endpoints
- Catalog: `/api/catalog/divisions`, `/api/catalog/products/{slug}`, `/api/catalog/compare`
- Review: `/api/admin/review/stats`, `/api/admin/review/products`, `/api/admin/review/smart-suggestions`
- Auto-Promote: `/api/admin/review/auto-promote/preview`, `/api/admin/review/auto-promote/execute`
- Actions: `.../approve`, `.../reject`, `.../edit-approve`, `.../bulk-approve`

## Key DB Collections
- catalog_products, catalog_skus
- brand_system_intelligence, family_relationships, semantic_rules
- web_verification_log (909 docs), promotion_log (~842 docs)

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw

## Priority Stack
1. ~~Phase 5A-J~~ DONE
2. **NEXT: Manual review of 65 true blockers** (conflicts, weak evidence, very low confidence)
3. Live DB push (ON HOLD — user explicitly stated not yet)
4. WhatsApp bot (ON HOLD — needs Interakt API key)
5. Archive old phase scripts to `scripts/archive/`

## Known Issues
- File 008 (corrupted DOCX) — BLOCKED
- Emergent LLM Key budget exhausted
- 65 products need manual review (42 conflicts, 29 very low conf, 15 weak evidence)
