# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India. Rebranded as "Agile Ortho".
Core requirement: Build a "SKU Intelligence System" — extract 100% of product data from 200 manufacturer brochures. 4-layer architecture (Raw Evidence -> Structured Drafts -> Normalized Products -> Training Chunks) feeding a Website Chatbot and WhatsApp AI Chatbot.

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font, react-helmet-async
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations (categorization + chatbot)
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API, Google Analytics 4

## SKU Intelligence System — COMPLETE

### Final Metrics (4 Mandatory Counts)
| Metric | Count |
|--------|-------|
| Raw extracted products | 523 |
| Normalized products | 481 |
| Unique SKU codes | 5,107 |
| SKU occurrences | 6,065 |

### Additional
- 97 unique brands across 13 divisions
- 654 training chunks (481 product + 36 overflow + 110 brand/intel + 20 glossary + 7 clinical)
- 3 confirmed duplicate file pairs (116/117, 162/163, 189/190)
- 1 blocked file (008 - corrupted DOCX)
- Source manifest tracks all 200 files by stable file_id

### Architecture
4-layer brochure data extraction:
- Layer 1: Raw per-file extractions (`raw_extractions/`)
- Layer 2: Structured drafts (`structured_drafts/`)
- Layer 3: Normalized product/SKU master (`normalized_products/`)
- Layer 4: Training chunks + Shadow DB

### Processing History
| Phase | Files | Products | SKUs | Status |
|-------|-------|----------|------|--------|
| Batch 1 | 001-025 | 287 | 1,273 | DONE |
| Batch 2 | 026-050 | 52 | 224 | DONE |
| Batch 3 | 051-075 | 27 | 929 | DONE |
| Batch 4 | 076-100 | 19 | 270 | DONE |
| Batch 5 | 101-125 | 18 | 627 | DONE |
| Batch 6 | 126-150 | 30 | 655 | DONE |
| Gap Fill | 151-155 | 5 | 12 | DONE |
| Batch 7 | 156-180 | 24 | 493 | DONE |
| Batch 8 | 181-200 | 19 | 624 | DONE |

### Readiness Steps — ALL COMPLETE
1. Cross-batch dedupe / alias cleanup — DONE
2. Full chunk expansion (5 categories) — DONE
3. Retrieval validation (91.7% pass rate) — DONE
4. Production-readiness assessment — READY WITH LIMITATIONS

### Key Rule
Source of truth = stable `file_id`, NOT ordinal position. Source manifest at `manifests/source_manifest_200.json`.

## Key API Endpoints
- `GET /api/divisions` — Returns all divisions
- `GET /api/products` — Paginated product listing
- `POST /api/chatbot/query` — Shadow DB chatbot query
- `GET /api/chatbot/stats` — Shadow DB statistics
- `GET /api/chatbot/brands` — All brands

## Upcoming Tasks
- P0: User to approve Shadow DB -> Live DB push
- P1: Website AI Chatbot frontend integration (data layer ready)
- P2: WhatsApp AI Chatbot (needs Interakt API key)
- P3: Add embedding/semantic search for improved retrieval
- P4: Confidence gating for off-topic query rejection

## Blocked
- File 008 (corrupted DOCX) — awaiting uncorrupted file
- WhatsApp bot — awaiting Interakt API key

## Admin Access
- URL: /admin/login
- Password: admin
