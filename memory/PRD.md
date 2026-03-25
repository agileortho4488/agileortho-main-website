# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India. Rebranded as "Agile Ortho".

## Core Requirements
1. **Portfolio Showcase** (React Frontend): Mega-menu, products by medical divisions
2. **Custom Inbuilt CRM** (MongoDB): Lead management with scoring engine
3. **Claude & Interakt Automation**: Admin PDF upload → extract product data → auto-draft pages
4. **"Master AI" RAG Chatbot**: Autonomous AI chatbot integrated with product DB
5. **Interakt Integration**: WhatsApp API for automated conversations, templates, webhooks
6. **UI/UX & SEO**: Clinical design with SEO configurations

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 (via emergentintegrations) for OCR/Vision + RAG chatbot
- **Data Extraction**: pdfplumber, pdf2image, pytesseract, pymupdf, python-pptx
- **3rd Party**: Interakt WhatsApp API, Google Analytics 4
- **Storage**: Emergent Object Storage for product images

## Architecture (Post-Refactoring)
```
/app/backend/
├── server.py          # Entry point (~70 lines) — CORS, routers, startup
├── db.py              # MongoDB connection + collections
├── models.py          # Pydantic models
├── helpers.py         # Auth, serialization, scoring, object storage
├── seed.py            # Seed data
├── routes/
│   ├── public.py      # Health, divisions, products, leads, file serving
│   ├── admin.py       # Login, dashboard, analytics, leads CRUD, products CRUD, image upload
│   ├── imports.py     # PDF import pipeline + Claude extraction
│   ├── chat.py        # RAG chatbot
│   └── whatsapp.py    # WhatsApp/Interakt integration
└── tests/

/app/frontend/src/
├── pages/             # All page components
├── components/ui/     # Shadcn UI components
└── lib/api.js         # API client
```

## What's Been Implemented

### Phase 1: Portfolio Website & CRM (DONE)
- Full product catalog (306 products, 13+ divisions)
- Mega-menu navigation, product detail pages
- Lead capture forms with scoring (Hot/Warm/Cold)
- Admin dashboard with analytics

### Phase 2: AI Integration (DONE)
- Claude AI PDF/PPTX importer with OCR (poppler/tesseract)
- RAG chatbot connected to product database
- SEO meta generation via Claude

### Phase 3: WhatsApp Integration (DONE)
- Interakt WhatsApp API (auto-replies, human takeover)
- Template messaging, delivery webhooks
- Contact syncing, event tracking, unified inbox

### Phase 4: Google Analytics (DONE)
- GA4 integrated (G-MXXC41JFLG)

### Phase 5: Product Image Upload & Refactoring (DONE — 2026-03-25)
- Object storage integration for product images
- Admin single-product image upload (drag & drop)
- Bulk image upload with SKU auto-matching
- Image delete functionality
- Refactored monolithic server.py (2200+ lines) into modular route files
- Cleaned up /app/brochures/ redundant scripts
- All 28 backend tests + full frontend UI tests passing (100%)

## Database Schema
- `products`: {product_name, sku_code, division, category, description, technical_specifications, images[], status, slug}
- `leads`: {name, hospital_clinic, phone_whatsapp, email, district, inquiry_type, score, status}
- `conversations`: {session_id, messages[], updated_at}
- `wa_conversations`: {phone, session_id, messages[], status (active/human)}
- `wa_message_status`: {message_id, phone, status, type}
- `wa_webhook_logs`: {event_type, timestamp, data_summary}

## Known Decisions
- **MongoDB over PostgreSQL**: Original request was PostgreSQL, but MongoDB was chosen for flexible schema (medical device specs vary widely). This is documented tech debt but not planned for migration.
- **HMAC webhook validation**: Non-blocking for Interakt webhooks due to inconsistent header transmission.

## Credentials
- Admin password: `admin`
- System packages needed: poppler-utils, tesseract-ocr
