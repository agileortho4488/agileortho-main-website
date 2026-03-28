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

### Phases 1-4: Pipeline, Chatbot, Taxonomy, Product Template — COMPLETE
### Phase 5A-E: Semantic Intelligence, Relationships, SKU Split, Comparison, QA — COMPLETE
### Phase 5F: Web-Search Fallback Pipeline — COMPLETE
### Phase 5G: Enrichment Review Dashboard — COMPLETE
### Phase 5H: Smart Review Suggestions — COMPLETE
### Phase 5I: Non-Pilot Shared-SKU Cleanup (ENT, Endo Surgery, Cardiovascular) — COMPLETE
### Phase 5J: 4-Lane Auto-Promotion Pipeline — COMPLETE (505 promoted, 65 manual)

### Phase 5K: Live Push + Search + Chatbot Integration — COMPLETE (2026-03-28)
- Expanded from 4 pilot divisions (157 products) → 13 divisions (810 products)
- LIVE_FILTER: enriched + no conflicts + no draft + medium/high confidence + no review_required
- Merged Products/Portfolio → single "Products" → `/catalog` path
- `/products` redirects to `/catalog`
- Catalog search expanded to 12 fields (name, brand, category, material, system_type, implant_class, division, family, clinical_subtitle, etc.)
- CatalogIndex has inline search with SearchResults component
- AI Chat (chat.py): search_relevant_products() queries catalog_products_col with LIVE_FILTER
- Chatbot (chatbot.py): Added search_catalog_products() — searches enriched catalog first, falls back to chunks
- WhatsApp (whatsapp.py): Inherits chat.py enriched search automatically
- SKU lookup in chatbot now uses catalog_skus_col
- Division descriptions for all 13 divisions
- Homepage: catalog API for divisions, search → /catalog, dynamic product count
- **Testing: 100% pass (13 backend + all frontend — iteration_47.json)**

## Current State
| Metric | Value |
|--------|-------|
| Total products in DB | 1,202 |
| Canonical enriched | 1,134 (94.3%) |
| Production-eligible (live) | 810 (67.4%) |
| Live divisions | 13 |
| Promoted total | 842 |
| Pending manual review | 65 |
| Excluded (review/conflict/low) | 324 |

## Key API Endpoints
- Catalog: `/api/catalog/divisions`, `/api/catalog/products?search=...`, `/api/catalog/products/{slug}`
- Chatbot: `/api/chatbot/query` (POST {question, session_id})
- AI Chat: `/api/chat` (POST {message, session_id})
- WhatsApp: `/api/whatsapp/webhook`
- Review: `/api/admin/review/stats`, `/api/admin/review/auto-promote/preview`
- Compare: `/api/catalog/compare`

## Admin Access
- URL: /admin/login
- Password: kOpcELYcEvkVtyDAE5-2uw

## Priority Stack
1. ~~Phase 5A-K~~ ALL DONE
2. Manual review of 65 true blockers (42 conflicts, 29 very low conf, 15 weak evidence)
3. WhatsApp bot via Interakt (already connected — verify webhook works end-to-end)
4. Archive old phase scripts to `scripts/archive/`

## Known Issues
- File 008 (corrupted DOCX) — BLOCKED
- Emergent LLM Key budget exhausted
- 65 products need manual review
- 324 products excluded from live (186 review_required, 4 conflicts, 126 low confidence)
