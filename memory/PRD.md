# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India. Rebranded as "Agile Ortho".

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font, react-helmet-async
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API, Google Analytics 4

## Current State (as of 2026-03-26)
- **814 products**, **10 divisions**, **100% image coverage**
- **Complete homepage redesign** — trust-first, conversion-focused, 10-section layout
- **Product pages redesigned** — Premium B2B aesthetic matching homepage (dark navy + teal)
- **SEO fully implemented** — react-helmet-async, JSON-LD structured data, 33 district pages
- **Automated CRM pipeline**: WhatsApp → Lead extraction → Scoring → Follow-ups
- **23 leads** (11 hot, 7 warm, 5 cold) with automated scoring

## SEO Implementation (2026-03-26)
### Dynamic Meta Tags (react-helmet-async)
- Per-page title, description, og:tags, canonical URLs
- Dynamic product titles/images for product detail pages
- Division-aware titles for filtered product listings

### JSON-LD Structured Data
- **Organization** — Homepage (company details, contact, address)
- **MedicalBusiness** — Homepage + 33 district pages (localized area served)
- **Product** — Each product detail page (name, SKU, manufacturer, brand)
- **BreadcrumbList** — All pages
- **ItemList** — Product listing pages

### District Landing Pages (33 districts)
- Route: `/districts` (index) + `/districts/:slug` (individual)
- Each page: localized hero, hospitals, medical focus, population, CTAs
- Internal linking: header nav, footer key districts column
- Targets: "medical devices in [District], Telangana" keywords

## Homepage Structure (10 Sections)
1. Utility bar (authorized distributor badge, contact)
2. Hero (buyer-focused, dark navy, static)
3. Trust metrics strip (SKUs, 10 divisions, 33 districts, 24/7 supply)
4. Who We Serve (5 cards)
5. Product Divisions (10 division cards)
6. Why Agile Ortho (6 value props)
7. Featured Products (8 diverse products)
8. How Ordering Works (4-step process)
9. Compliance Band
10. Final CTA

## Divisions (10)
Orthopedics (308), Endo-surgical (171), Diagnostics (105), Infection Prevention (85), Cardiovascular (66), ENT (45), Critical Care (23), Peripheral Intervention (6), Urology (3), Robotics (2)

## Key API Endpoints
- `GET /api/products/featured/homepage` — Diverse homepage products
- `GET /api/divisions` — Division list with counts
- `GET /api/products` — Product listing with pagination/filters
- `GET /api/products/:id` — Single product detail
- `POST /api/leads` — Submit lead / quote request
- `POST /api/webhook/whatsapp` — Interakt webhook
- `GET /api/admin/automation/stats` — CRM automation statistics

## Upcoming Tasks
- P2: WhatsApp Interactive Elements — Quick reply buttons, campaign management
- P2: Facebook Developer Account Integration — CAPI and Lead Ads

## Future/Backlog
- P3: Product comparison feature
- P4: MongoDB → PostgreSQL migration (tech debt)

## Admin Access
- URL: /admin/login
- Password: admin
