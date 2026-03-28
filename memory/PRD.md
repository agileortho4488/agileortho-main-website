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
- 3 MongoDB collections: brand_system_intelligence, family_relationships, semantic_rules
- Clinical-first naming by division

### Phase 5B: Relationship Graph + Related Products — COMPLETE
- 3 labeled buckets: Compatible Components, Same Family Alternatives, Related System Products

### Phase 5C: Split Shared-SKU Products — COMPLETE
- 6 pools resolved, 1,296 SKUs reassigned, 27 products merged

### Phase 5D: Product Comparison — COMPLETE
- Side-by-side comparison with clinical guardrails

### Phase 5E: Comparison QA + Clinical Guardrails — COMPLETE
- Cross-class comparisons blocked

### Phase 5F: Web-Search Fallback Pipeline — COMPLETE (2026-03-28)
- 774 products via LLM+SerpAPI, 135 via rule-based sibling inheritance
- 100% coverage (909 staged) with 4-tier source priority
- Auto-promoted 243 products to canonical fields
- DB snapshot at `/app/backend/scripts/pre_promotion_snapshot.json`

### Phase 5G: Enrichment Review Dashboard — COMPLETE (2026-03-28)
- Full admin dashboard at `/admin/review`
- Product-level: filters (division, brand, status, action, confidence, family), side-by-side comparison, approve/reject/edit+approve
- Family-level: bulk approve by family pattern for repeated sub-variants
- Audit trail: promotion_log collection with reviewer, timestamp, old/new values
- **Testing: 100% pass (40/40 backend, all frontend — iteration_42.json)**

## Current State
| Metric | Value |
|--------|-------|
| Total products | 1,206 |
| Canonical enriched | ~565 (46.8%) |
| Staged (proposed) | ~640 pending review |
| Promoted | ~268 |
| Promotion log entries | ~268 |

## Key API Endpoints
- `GET /api/catalog/divisions`, `GET /api/catalog/products/{slug}`
- `POST /api/catalog/compare`, `GET /api/catalog/compare/suggestions/{slug}`
- `GET /api/admin/review/stats`, `GET /api/admin/review/products`
- `GET /api/admin/review/products/{slug}`, `POST /api/admin/review/products/{slug}/approve`
- `POST /api/admin/review/products/{slug}/reject`, `POST /api/admin/review/products/{slug}/edit-approve`
- `POST /api/admin/review/bulk-approve`, `GET /api/admin/review/families`

## Key DB Collections
- catalog_products, catalog_skus
- brand_system_intelligence, family_relationships, semantic_rules
- web_verification_log (909 docs), promotion_log (~268 docs)

## Key Scripts
- `/app/backend/scripts/web_search_fallback.py` — Main pipeline (dry-run, wave, promote)
- `/app/backend/scripts/rule_based_remaining.py` — Sibling inheritance fallback
- `/app/backend/scripts/pre_promotion_snapshot.json` — DB backup before promotion

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw

## Priority Stack
1. ~~Phase 5A-G~~ DONE
2. **NEXT: Review the 640 pending products** using the dashboard (user action)
3. Non-pilot division shared-SKU cleanup (ENT, Endo Surgery)
4. Live DB push (ON HOLD)
5. WhatsApp bot (ON HOLD — needs Interakt API key)

## Known Issues
- File 008 (corrupted DOCX) — BLOCKED, awaiting replacement
- Emergent LLM Key budget exhausted — 135 products used rule-based fallback
- Some products have empty slugs (127 items) — handled via _id-based operations
