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
├── server.py          # Entry point (~85 lines)
├── db.py, models.py, helpers.py, seed.py
├── routes/
│   ├── public.py      # Products, leads, divisions, files
│   ├── admin.py       # Dashboard, CRUD, image upload
│   ├── imports.py     # PDF import pipeline
│   ├── chat.py        # RAG chatbot
│   ├── whatsapp.py    # WhatsApp/Interakt (rewritten with improvements)
│   ├── bulk_upload.py # Bulk catalog upload
│   ├── image_extract.py # Brochure image extraction
│   └── automation.py  # NEW: CRM automation, follow-ups, lead scoring
```

## Current State (as of 2026-03-26)
- **814 clean products** across **10 divisions**, **100% image coverage**
- **Fully automated CRM pipeline**: WhatsApp → Lead extraction → Scoring → Follow-ups
- **Background scheduler** processing follow-up queue every 60s

## Automated Sales Pipeline (NEW)
```
WhatsApp Message → Instant Welcome → AI Response (chunked)
       ↓
  1st message: Basic lead created (cold)
       ↓
  2nd message: AI extracts name, hospital, district, products, buying intent
       ↓
  Lead scored: hot (70+) / warm (40-69) / cold (<40)
       ↓
  Follow-up sequence auto-scheduled:
    Hot:  1h → 6h → 24h → 72h (specialist connect, catalog, offer)
    Warm: 2h → 24h → 72h → 168h (info, catalog, reconnect)
    Cold: 24h → 168h (gentle followup, value prop)
       ↓
  Background scheduler sends follow-ups automatically
```

## WhatsApp Improvements Implemented
1. Instant welcome message for new contacts
2. Shorter WhatsApp-specific system prompt (2 sentences max)
3. Message chunking — split long replies into 2-3 short messages with typing delay
4. AI-powered lead extraction from conversations
5. Auto lead scoring based on 10 signals
6. Automated follow-up sequences (hot/warm/cold)

## Divisions (10)
Orthopedics (308), Endo-surgical (171), Diagnostics (105), Infection Prevention (85), Cardiovascular (66), ENT (45), Critical Care (23), Peripheral Intervention (6), Urology (3), Robotics (2)

## Key API Endpoints
- `POST /api/webhook/whatsapp` — Interakt webhook (message_received)
- `GET /api/admin/automation/stats` — CRM automation statistics
- `GET /api/admin/automation/followup-queue` — Pending follow-ups
- `POST /api/admin/automation/trigger-followups` — Process due follow-ups
- `POST /api/admin/automation/rescore-leads` — Re-analyze all conversations
- `POST /api/admin/automation/schedule-followups/{phone}` — Manual schedule
- `GET /api/products` — Public product listing
- `GET /api/divisions` — Division list with counts

## Contact Numbers in Chatbot
- Dispatch & Delivery: 741818183
- Orthopedics & Spine Orders: 74161612350
- General Queries: 7416216262
- Consumables & Other Divisions: 7416416871
- Billing & Finance: 7416416093

## Upcoming Tasks
- P1: SEO & Polish — react-helmet-async, JSON-LD, district landing pages
- P2: Homepage Redesign (Meril style)
- P2: Admin dashboard for CRM automation (visual stats, follow-up management)

## Future/Backlog
- P3: Product image gallery, product comparison
- P3: WhatsApp interactive buttons (quick replies)
- P3: Campaign management (bulk WhatsApp templates to segments)
- P4: MongoDB → PostgreSQL migration

## Admin Access
- URL: /admin/login
- Password: admin
