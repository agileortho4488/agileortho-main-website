# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India. Rebranded as "Agile Ortho".

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API, Google Analytics 4

## Current State (as of 2026-03-26)
- **814 products**, **10 divisions**, **100% image coverage**
- **Complete homepage redesign** — trust-first, conversion-focused, 10-section layout
- **Product pages redesigned** — Premium B2B aesthetic matching homepage (dark navy + teal)
- **Automated CRM pipeline**: WhatsApp → Lead extraction → Scoring → Follow-ups
- **23 leads** (11 hot, 7 warm, 5 cold) with automated scoring

## Homepage Structure (10 Sections)
1. Utility bar (authorized distributor badge, contact)
2. Hero (buyer-focused, dark navy, static)
3. Trust metrics strip (SKUs, 10 divisions, 33 districts, 24/7 supply)
4. Who We Serve (5 cards: Hospitals, Clinics, Diagnostic Centers, OT Teams, Procurement)
5. Product Divisions (10 division cards with descriptions, counts, CTAs)
6. Why Agile Ortho (6 value props)
7. Featured Products (8 diverse products from different divisions)
8. How Ordering Works (4-step procurement process)
9. Compliance Band (MD-42, CDSCO, GST, authorized distributor)
10. Final CTA (Request Quote + WhatsApp + Call)

## Product Pages Design (Redesigned 2026-03-26)
### Products Listing
- Dark navy hero banner with breadcrumb, search bar, product count
- Sidebar with division icons, product counts, active state styling
- Grid/List toggle, 12 products per page, teal-accented cards
- Active filters strip, mobile-responsive filter panel

### Product Detail
- Dark hero with breadcrumb navigation
- Product image, division/category badges, key features
- B2B CTAs: Request Bulk Quote, WhatsApp Enquiry, Call Sales Team
- Quote modal with form validation (name + phone required)
- Tabbed content: Overview, Specifications, Sizes & Variants
- Trust badges: ISO 13485, CE Mark, CDSCO, Authorized Distributor
- Related products grid, Need Help banner

## Divisions (10)
Orthopedics (308), Endo-surgical (171), Diagnostics (105), Infection Prevention (85), Cardiovascular (66), ENT (45), Critical Care (23), Peripheral Intervention (6), Urology (3), Robotics (2)

## Key API Endpoints
- `GET /api/products/featured/homepage` — Diverse products for homepage showcase
- `GET /api/divisions` — Division list with counts
- `GET /api/products` — Product listing with pagination/filters
- `GET /api/products/:id` — Single product detail
- `POST /api/leads` — Submit lead / quote request
- `POST /api/webhook/whatsapp` — Interakt webhook
- `GET /api/admin/automation/stats` — CRM automation statistics

## Upcoming Tasks
- P1: SEO — react-helmet-async, JSON-LD structured data, meta tags
- P1: District landing pages for Telangana local SEO
- P2: WhatsApp Interactive Elements — Quick reply buttons, campaign management
- P2: Facebook Developer Account Integration — CAPI and Lead Ads

## Future/Backlog
- P3: Product comparison feature
- P4: MongoDB → PostgreSQL migration (tech debt)

## Admin Access
- URL: /admin/login
- Password: admin
