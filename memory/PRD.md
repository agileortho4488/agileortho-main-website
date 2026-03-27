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

### Final Metrics
| Metric | Count |
|--------|-------|
| Raw extracted products | 523 |
| Normalized products | 481 |
| Unique SKU codes | 5,107 |
| SKU occurrences | 6,065 |
| Brands | 97 |
| Divisions | 13 |
| Training chunks | 654 |

### Chunk Breakdown (5 categories)
| Category | Count |
|----------|-------|
| Product | 481 |
| SKU overflow | 36 |
| Brand/Intelligence | 110 |
| Glossary/Reference | 20 |
| Clinical Evidence | 7 |

### Readiness Steps — ALL COMPLETE
1. Cross-batch dedupe / alias cleanup — DONE
2. Full chunk expansion (5 categories) — DONE
3. Retrieval validation — **100% pass rate (35/35)**, up from 91.7%
4. Production-readiness assessment — READY

### Chatbot Guardrails — IMPLEMENTED
1. **Confidence gating**: High → direct answer, Medium → with verification note, Low → graceful refusal
2. **SKU exact-match**: Direct DB lookup with prefix fallback
3. **Off-topic rejection**: Anti-domain signal detection, word-boundary safe

### Architecture
- Layer 1: Raw extractions (`raw_extractions/`)
- Layer 2: Structured drafts (`structured_drafts/`)
- Layer 3: Normalized masters (`normalized_products/`)
- Layer 4: Training chunks + Shadow DB
- Source of truth: `file_id` (NOT ordinal position)
- Central nervous system: `SYSTEM_STATE.json`

## Website Chatbot UI — COMPLETE (2026-03-27)

### Features Implemented
- **Confidence-aware chat bubbles**: Green "Verified Match" badge (high), amber "Partial Match" badge (medium), grey "No Match" badge (low/none)
- **WhatsApp handoff banners**: Shown for medium/low/none confidence responses, enabling smooth escalation to human sales reps
- **Session tracking**: Conversations stored in `chatbot_conversations` collection with full turn history
- **Telemetry logging**: All queries, confidence levels, handoff offers, and handoff clicks logged to `chatbot_telemetry` collection
- **Full-page chat** (`/chat`): Complete chat experience with suggestions, history persistence
- **Floating chat widget**: Bottom-right widget on all pages with same confidence-aware rendering
- **Lead form trigger**: Auto-shows after 2+ non-high-confidence responses in the widget

### API Endpoints
- `POST /api/chatbot/query` — Guarded chatbot query
- `GET /api/chatbot/history/{session_id}` — Conversation history
- `POST /api/chatbot/telemetry` — Log UI telemetry events
- `GET /api/chatbot/telemetry/report?days=7` — Admin 7-day telemetry
- `GET /api/chatbot/suggestions` — Contextual suggestions
- `GET /api/chatbot/stats` — Shadow DB statistics
- `GET /api/chatbot/brands` — All brands
- `GET /api/chatbot/products` — Products with filtering
- `GET /api/chatbot/skus` — SKUs with filtering

## Telemetry Report — COMPLETE (2026-03-27)

## Catalog Taxonomy Mapping (Phase 1) — COMPLETE (2026-03-27)

### Created 6 MongoDB Collections
| Collection | Records | Purpose |
|-----------|---------|---------|
| `catalog_division_map` | 15 | Division mapping |
| `catalog_category_map` | 211 | Category mapping |
| `catalog_material_dict` | 293 | Material normalization |
| `catalog_brand_dict` | 89 | Brand normalization |
| `catalog_product_family_map` | 643 | Product family grouping |
| `catalog_taxonomy` | 1 | Master audit summary |

## Catalog Merge (Phase 2) — COMPLETE (2026-03-27)
Built `catalog_products` (1206 records) and `catalog_skus` (5882 records) by merging live commerce data with shadow brochure enrichment.

## Standardized Product Template (Phase 3) — COMPLETE (2026-03-27)
- Product listing page with category/brand filters, search, grid/list view, pagination
- Product detail page with Family Info, SKU Table, Tech Specs, Related Products, Quote Form, CTA buttons

## Trauma Pilot (Phase 4) — COMPLETE (2026-03-27)
- P0/P1 template polish: Category placeholders, Family Code label, Title-cased specs, Unified coating terms, Brand hierarchy "{Brand} by Meril", Dedicated brochure section
- Tested across 5 product types: plate, nail, screw, system, many-variant (100% pass)

## Multi-Division Expansion — COMPLETE (2026-03-27)

### Expanded to 4 divisions
| Division | Products | Categories | Brands | Icon | Color |
|----------|----------|------------|--------|------|-------|
| Trauma | 44 | 12 | 6 | Bone | Amber |
| Cardiovascular | 8 | 4 | 4 | HeartPulse | Rose |
| Diagnostics | 63 | 7 | 4 | Microscope | Violet |
| Joint Replacement | 7 | 5 | 4 | Activity | Teal |

### New Frontend Pages
- `/catalog` — Portfolio index page showing all 4 division cards
- `/catalog/:divisionSlug` — Generic division listing (CatalogDivision.jsx)
- Updated product detail breadcrumbs to use dynamic division routing

### API Endpoints Added
- `GET /api/catalog/divisions/{slug}` — Single division detail by slug
- Updated all product endpoints to include `division_slug` field

### Test Results
- iteration_31.json: P0/P1 Trauma template — 100% pass (13/13 backend, frontend 100%)
- iteration_32.json: Multi-division expansion — 100% pass (22/22 backend, frontend 100%)

## Priority Stack (User Approved)
1. ~~Confidence gating~~ DONE
2. ~~Off-topic rejection~~ DONE
3. ~~SKU exact-match improvement~~ DONE
4. ~~Re-validation~~ DONE (100%)
5. ~~Website chatbot UI integration~~ DONE
6. ~~Telemetry report endpoint~~ DONE
7. ~~Catalog taxonomy mapping (Phase 1)~~ DONE
8. ~~Catalog merge (Phase 2)~~ DONE
9. ~~Standardized product template (Phase 3)~~ DONE
10. ~~Trauma pilot (Phase 4)~~ DONE
11. ~~Multi-division expansion (Cardiovascular, Diagnostics, Joint Replacement)~~ DONE
12. Product comparison feature
13. Live DB push (ON HOLD)
14. WhatsApp bot (ON HOLD)

## Blocked
- File 008 (corrupted DOCX)
- WhatsApp bot (needs Interakt API key)

## Admin Access
- URL: /admin/login
- Password: admin
