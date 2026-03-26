# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India. Rebranded as "Agile Ortho".

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font, react-helmet-async
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations (categorization + chatbot)
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API, Google Analytics 4

## Current State (as of 2026-03-26)
- **967 products**, **13 divisions**, AI-categorized with consistent naming
- **78 Variabilis products** newly imported from PDF brochure
- **5 new brochure PDFs** uploaded to Object Storage and linked to products
- **AI Categorization System** built — processes all products using Claude Sonnet 4.5
- **Product data bundled** as `product_data.json` (967 products) + `lead_data.json` for auto-seeding
- **Complete homepage redesign** — trust-first, conversion-focused, 10-section layout
- **Product pages redesigned** — Premium B2B aesthetic (dark navy + teal)
- **SEO fully implemented** — react-helmet-async, JSON-LD structured data, 33 district landing pages
- **Automated CRM pipeline**: WhatsApp → Lead extraction → Scoring → Follow-ups
- **Gated brochure downloads** with CRM lead capture

## Division Structure (13 Divisions, 967 Products)
| Division | Products | Key Categories |
|---|---|---|
| Trauma | 218 | Distal Radial Plates, Bone Screws, Locking Screws, Humerus Plates, Intramedullary Nails |
| Endo-surgical | 167 | Sutures, Endocutters, Hernia Mesh, Staplers, Ultrasonic Instruments |
| Joint Replacement | 112 | Hip Implants, Knee Implants, Revision Knee Systems, Total Knee/Hip Replacement |
| Diagnostics | 105 | Biochemistry Reagents, Rapid Diagnostic Tests, Blood Typing, Drug Testing |
| Infection Prevention | 85 | Surgical Drapes, Surgical Gowns, Hand Hygiene, Skin Preparation |
| Cardiovascular | 60 | Heart Valves, Coronary Stents, TAVR Systems, Embolization |
| Sports Medicine | 54 | Shoulder Arthroscopy, Knee Arthroscopy, Equipment |
| Instruments | 52 | Surgical Instruments, Instrument Sets, Storage Systems |
| ENT | 45 | Balloon Catheters, Airway Management, Nasal Devices, Tracheostomy |
| Urology | 28 | Guidewires, Stents, Sheaths, Stone Baskets |
| Critical Care | 23 | Respiratory Care, Renal Care, Regional Anesthesia |
| Peripheral Intervention | 12 | Peripheral Stents, Balloon Catheters |
| Robotics | 6 | Surgical Robotic Systems, Orthopedic Robotics |

## Database Seeding
- `seed.py` loads from `product_data.json` and `lead_data.json` on startup
- Uses SKU-based upsert to avoid duplicates
- Auto-seeds when product count < file count

## Key API Endpoints
- `GET /api/divisions` — Returns all divisions with categories and counts
- `GET /api/products` — Paginated product listing with search/filter
- `GET /api/products/:id` — Product detail
- `POST /api/leads` — Create lead
- `POST /api/brochure-download` — Gated brochure download with lead capture
- `POST /api/webhook/whatsapp` — WhatsApp webhook
- `GET /api/admin/automation/stats` — Automation dashboard

## Upcoming Tasks
- P1: Push re-deployment to sync live database with 967 products
- P2: WhatsApp Interactive Elements — Quick reply buttons, campaign management
- P2: Facebook Developer Account Integration — CAPI and Lead Ads

## Future/Backlog
- P3: Product comparison feature
- P4: MongoDB → PostgreSQL migration (if needed)

## Admin Access
- URL: /admin/login
- Password: admin
