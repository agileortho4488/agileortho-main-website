# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India. Rebranded as "Agile Ortho".

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API, Google Analytics 4

## Architecture (Modular)
```
/app/backend/
├── server.py          # Entry point (~75 lines)
├── db.py, models.py, helpers.py, seed.py
├── routes/
│   ├── public.py      # Products, leads, divisions, files
│   ├── admin.py       # Dashboard, CRUD, image upload
│   ├── imports.py     # PDF import pipeline
│   ├── chat.py        # RAG chatbot
│   ├── whatsapp.py    # WhatsApp/Interakt
│   ├── bulk_upload.py # Bulk catalog upload
│   └── image_extract.py # Brochure image extraction
```

## Current State (as of 2026-03-26)
- **814 clean products** across **10 divisions**
- **100% image coverage** (3-tier: direct match → family propagation → division fallback)
- **100% descriptions**, **99% specs as proper dict**, **0 duplicates**, **0 junk**

## Divisions (10)
Orthopedics (308), Endo-surgical (171), Diagnostics (105), Infection Prevention (85), Cardiovascular (66), ENT (45), Critical Care (23), Peripheral Intervention (6), Urology (3), Robotics (2)

## Completed Features
- Portfolio website with 814 products across 10 divisions
- Kanban CRM with lead scoring
- Claude AI PDF/PPTX importer with OCR + Vision
- RAG chatbot with department-specific contact routing
- Interakt WhatsApp integration (auto-replies, templates, webhooks)
- Google Analytics 4
- Product image upload (single + bulk) via object storage
- Server refactored from 2200-line monolith to modular routes
- Bulk catalog processing: 200 files from Google Drive → object storage → Claude extraction
- Full data audit: cleaned junk, fixed duplicates, merged Trauma→Orthopedics, Cardiac Surgery→Cardiovascular
- Brochure image extraction v2: cover page rendering + family propagation + division fallback
- Fixed 183 string specs → proper dict format
- Key Features rendering bug fixed

## Image Extraction Pipeline (3-Tier)
1. **Tier 1 — Direct match (181 products)**: PDF cover page rendered at 200 DPI, fuzzy-matched to product by brochure filename
2. **Tier 2 — Family propagation (341 products)**: Same product line's brochure cover shared across variants (e.g., all BioMime variants get the BioMime brochure cover)
3. **Tier 3 — Division fallback (268 products)**: Representative brochure from the same division assigned to unmatched products. User can replace these with Canva-exported images via admin bulk upload.

## Contact Numbers in Chatbot
- Dispatch & Delivery: 741818183
- Orthopedics & Spine Orders: 74161612350
- General Queries: 7416216262
- Consumables & Other Divisions: 7416416871
- Billing & Finance: 7416416093

## Upcoming Tasks
- P1: SEO & Polish — react-helmet-async, JSON-LD, district landing pages
- P2: Homepage Redesign (Meril style)
- P3: Product image gallery on public pages (multiple images per product)
- P3: Product comparison feature
- P4: MongoDB → PostgreSQL migration (tech debt)

## Key API Endpoints
- `GET /api/products` — Public product listing with pagination/filters
- `GET /api/products/{id}` — Single product detail
- `GET /api/divisions` — Division list with counts
- `POST /api/admin/extract-brochure-images` — Trigger brochure image extraction
- `GET /api/admin/extract-brochure-images/status` — Extraction job status
- `DELETE /api/admin/clear-brochure-images` — Clear extracted images for re-run
- `GET /api/admin/products-without-images` — Products missing images
- `POST /api/admin/products/{id}/images` — Upload product images
- `POST /api/admin/products/bulk-images` — Bulk image upload with SKU matching
- `GET /api/files/{path}` — Serve files from object storage

## Admin Access
- URL: /admin/login
- Password: admin
