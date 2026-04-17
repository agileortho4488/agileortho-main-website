# AGILE HEALTHCARE — Complete Project Report
## B2B Medical Device Distribution Platform
### Meril Life Sciences Master Franchise, Telangana

---

## 1. PROJECT OVERVIEW

### 1.1 What Is This Platform?

Agile Healthcare is a **full-stack B2B medical device distribution platform** built for the authorized Meril Life Sciences master franchise in Telangana, India. It serves as the digital backbone for sales, marketing, CRM, and operations — connecting the company with **hospitals, surgeons, and diagnostic centers** across all 33 districts of Telangana.

### 1.2 Business Context

| Item | Detail |
|------|--------|
| **Company** | Agile Healthcare (brand: AgileOrtho) |
| **Role** | Master franchise distributor for Meril Life Sciences |
| **Territory** | All 33 districts of Telangana, India |
| **Products** | 967 medical devices across 13 clinical divisions |
| **Customers** | Hospitals, surgical centers, diagnostic labs |
| **Website** | [agileortho.in](https://agileortho.in) |
| **WhatsApp** | +91 7416521222 (via Interakt) |
| **Phone** | +91 8500204488 |

### 1.3 Platform Purpose

1. **Product Discovery** — 810+ live catalog products with specs, images, and pricing
2. **Lead Generation** — AI chatbot, WhatsApp integration, contact forms
3. **Sales CRM** — Pipeline management, lead scoring, territory analytics
4. **Customer Engagement** — WhatsApp campaigns, automated follow-ups
5. **SEO & Marketing** — Technical SEO, district pages, schema markup
6. **Business Intelligence** — Competitive intel, search analytics, hospital mapping

---

## 2. TECHNOLOGY STACK

### 2.1 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  React 19 + TailwindCSS + Shadcn/UI                │
│  24 pages | 55 components | 15,502 lines            │
├─────────────────────────────────────────────────────┤
│                     API LAYER                        │
│  FastAPI + Python 3.x                               │
│  17 route files | 117 endpoints | 22,428 lines      │
├─────────────────────────────────────────────────────┤
│                    DATABASE                          │
│  MongoDB (via Motor async driver)                    │
│  44 collections | 31,636 documents                   │
├─────────────────────────────────────────────────────┤
│               INTEGRATIONS                           │
│  Interakt (WhatsApp) | OpenAI (Chatbot)             │
│  Google Analytics | Meta Pixel (pending)             │
└─────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack Details

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.0.0 |
| **Routing** | React Router DOM | 7.5.1 |
| **Styling** | TailwindCSS + Shadcn/UI | Latest |
| **Icons** | Lucide React | 0.507.0 |
| **Charts** | Recharts | (installed) |
| **Animations** | Framer Motion | 12.38.0 |
| **SEO** | React Helmet Async | 3.0.0 |
| **Toasts** | Sonner | 2.0.3 |
| **Security** | DOMPurify | 3.3.3 |
| **Backend** | FastAPI | 0.110.1 |
| **Database** | MongoDB (Motor) | 3.3.1 |
| **AI** | OpenAI | 1.99.9 |
| **Auth** | JWT + bcrypt | SHA-256 fallback |
| **HTTP** | Requests | 2.32.5 |
| **Data** | Pandas | 2.3.3 |

### 2.3 Hosting & Deployment

| Component | Detail |
|-----------|--------|
| **Domain** | agileortho.in |
| **CDN** | Cloudflare |
| **Backend** | FastAPI on port 8001 (supervisor-managed) |
| **Frontend** | React on port 3000 (supervisor-managed) |
| **Database** | MongoDB (hosted) |
| **WhatsApp** | Interakt webhook integration |

---

## 3. DATABASE — COMPLETE DATA INVENTORY

### 3.1 All Collections (44 total, 31,636 documents)

| Collection | Documents | Purpose |
|------------|-----------|---------|
| **crm_contacts** | 10,452 | All contact records |
| **catalog_skus** | 5,882 | Individual SKU variants |
| **shadow_skus** | 3,978 | Shadow/staging SKU data |
| **leads** | 1,287 | CRM leads (scored & staged) |
| **wa_conversations** | 1,270 | WhatsApp chat threads |
| **outreach_contacts** | 1,409 | Outreach/campaign contacts |
| **catalog_products** | 1,202 | Live catalog (public-facing) |
| **products** | 967 | Master product database |
| **promotion_log** | 842 | Product promotion history |
| **web_verification_log** | 909 | SEO/web verification records |
| **catalog_product_family_map** | 643 | Product family groupings |
| **shadow_chunks** | 462 | Shadow product data chunks |
| **shadow_products** | 433 | Shadow/staging products |
| **catalog_material_dict** | 293 | Material reference dictionary |
| **email_tracking** | 248 | Email send/open tracking |
| **catalog_category_map** | 211 | Category hierarchy mapping |
| **catalog_files** | 200 | Uploaded catalog files (PDFs) |
| **visitor_events** | 192 | Website visitor tracking |
| **discovered_surgeons** | 105 | Mapped hospitals & surgeons |
| **catalog_brand_dict** | 89 | Brand reference dictionary |
| **shadow_brands** | 75 | Shadow brand data |
| **chatbot_telemetry** | 67 | AI chatbot query analytics |
| **otp_codes** | 65 | OTP verification codes |
| **pdf_imports** | 64 | PDF brochure imports |
| **chatbot_conversations** | 51 | AI chatbot conversations |
| **wa_webhook_logs** | 26 | WhatsApp webhook event log |
| **automation_logs** | 22 | Automation run history |
| **followup_queue** | 22 | Pending follow-up tasks |
| **brand_system_intelligence** | 18 | Brand relationship intelligence |
| **conversations** | 17 | General conversations |
| **semantic_rules** | 16 | Semantic matching rules |
| **catalog_division_map** | 15 | Division hierarchy |
| **surgeons** | 15 | Surgeon profiles |
| **geo_cache** | 14 | Geographic data cache |
| **wa_message_status** | 12 | WhatsApp delivery tracking |
| **shadow_taxonomy** | 11 | Shadow taxonomy data |
| **family_relationships** | 11 | Brand/product relationships |
| **users** | 10 | Platform user accounts |
| **profile_views** | 6 | Profile view tracking |
| **articles** | 1 | Content articles |
| **campaign_stats** | 1 | Campaign statistics |
| **catalog_merge_report** | 1 | Catalog merge reports |
| **catalog_taxonomy** | 1 | Master taxonomy |
| **extract_jobs** | 1 | Data extraction jobs |
| **learning_cache** | 1 | ML learning cache |

---

## 4. PRODUCT CATALOG

### 4.1 Division Breakdown (13 Divisions, 967 Products)

| Division | Products | Categories | Key Brands |
|----------|----------|------------|------------|
| Trauma | 218 | 20 | ARMAR, AURIC, KET, CLAVO, MBOSS |
| Endo-Surgical | 168 | 13 | MIRUS, MERIGROW, MYCLIP |
| Joint Replacement | 112 | 14 | DESTIKNEE, FREEDOM, LATITUDE |
| Diagnostics | 105 | 11 | AUTOQUANT, MERISCREEN, MERISERA |
| Infection Prevention | 85 | 10 | BAKTIO, CEROSAFE |
| Cardiovascular | 60 | 13 | BIOMIME, MOZEC |
| Instruments | 53 | 6 | Drill Bits, Instrument Sets |
| Sports Medicine | 53 | 3 | ROTAFIX, FILAHOOK |
| ENT | 45 | 11 | Airway Management, Nasal Devices |
| Urology | 28 | 9 | Catheters, Stents, Guidewires |
| Critical Care | 23 | 8 | BREATHFLEX |
| Peripheral Intervention | 13 | 5 | Balloon Catheters |
| Robotics | 4 | 2 | CORIN OMNI |

### 4.2 Catalog Pipeline
```
PDF Brochures → PDF Import/Extract → Shadow Products → Review Dashboard → Approved → Live Catalog
                  (64 imports)          (433 products)    (auto-promote)     (1,202 live)
```

### 4.3 Product Data Richness

| Data Point | Coverage |
|------------|----------|
| Product Name | 100% |
| SKU Code | 100% (5,882 SKUs) |
| Division | 100% |
| Category | 100% (125+ categories) |
| Material | ~85% |
| Technical Specifications | ~70% |
| Images | ~60% |
| Slug (SEO URL) | 100% |
| Product Family | ~65% (643 families) |

---

## 5. CRM & SALES ENGINE

### 5.1 Lead Statistics

| Metric | Value |
|--------|-------|
| **Total Leads** | 1,287 |
| **Hot Leads** | 18 |
| **Warm Leads** | 14 |
| **Cold Leads** | 1,255 |
| **From Interakt Sync** | 1,241 |
| **From Website** | 27 |
| **From WhatsApp** | 12 |
| **From Product Detail** | 1 |

### 5.2 CRM Pipeline (6 Stages)

```
NEW (1,258) → CONTACTED (2) → QUALIFIED (2) → NEGOTIATION (2) → WON (1) → LOST (1)
```

### 5.3 Lead Scoring System

| Score | Threshold | Count | Criteria |
|-------|-----------|-------|----------|
| **Hot** | ≥ 70 points | 18 | Name (+15), Hospital (+20), Email (+10), Product Interest (+15), Buying Intent (+25), Urgency (+15) |
| **Warm** | ≥ 40 points | 14 | Some engagement, partial info |
| **Cold** | < 40 points | 1,255 | Minimal engagement, sync-only |

### 5.4 Automation Engine

| Feature | Status |
|---------|--------|
| Lead auto-scoring | Active |
| Follow-up scheduling | Active (22 in queue) |
| WhatsApp auto-reply | Active (1 contextual AI reply per message) |
| Reorder prediction | Planned (Phase 2) |

---

## 6. WHATSAPP INTEGRATION

### 6.1 Architecture

```
Customer WhatsApp → Interakt → Webhook → Our Backend → AI Bot Reply
                                  ↓
                          MongoDB (conversations, delivery stats)
                                  ↓
                          Admin Dashboard (inbox, analytics)
```

### 6.2 Statistics

| Metric | Value |
|--------|-------|
| WhatsApp Conversations | 1,270 |
| Webhook Events Captured | 26 |
| Interakt Contacts Synced | 1,261 |
| Campaign Events Tracked | 2 |
| Bot Auto-Reply | 1 contextual AI reply per message |

### 6.3 Features

| Feature | Status |
|---------|--------|
| Real-time webhook message ingestion | Active |
| AI chatbot auto-reply (OpenAI) | Active |
| Campaign broadcast tracking (read/delivered/failed) | Active |
| Contact Sync: Pull from Interakt to CRM | Active |
| Contact Sync: Push CRM leads to Interakt | Active |
| Template message sending | Active |
| Conversation inbox with message threads | Active |
| Delivery analytics dashboard | Active |

---

## 7. AI CHATBOT

### 7.1 How It Works

```
Customer Query → Product Search (MongoDB) → Context Assembly → OpenAI GPT → Response
                                                    ↓
                                          Telemetry Logging (67 queries)
```

### 7.2 Usage Stats

| Metric | Value |
|--------|-------|
| Total Conversations | 51 |
| Total Queries | 67 |
| Confidence Distribution | High: 35, Medium: ~20, Low: ~12 |

### 7.3 Capabilities

- Product information and specifications
- Bulk pricing quotation guidance
- Division/category browsing
- Connect-to-specialist routing
- WhatsApp-integrated (replies via Interakt API)

---

## 8. GEOGRAPHIC INTELLIGENCE

### 8.1 Territory Coverage

| Zone | Description |
|------|-------------|
| Zone 1 | Hyderabad Metropolitan |
| Zone 2 | North Telangana |
| Zone 3 | South Telangana |
| Zone 4 | West Telangana |

### 8.2 District Pages

All **33 districts** of Telangana have dedicated service area pages with:
- Local hospital mapping
- FAQ sections with FAQPage JSON-LD schema
- SEO-optimized meta tags
- District-specific product availability

### 8.3 Hospital Intelligence

| Metric | Value |
|--------|-------|
| Discovered Hospitals/Surgeons | 105 |
| Hospitals in Dashboard | 19 (with analytics) |
| Competitive Intel Tracked | 24 competitors |
| Upsell Opportunities Identified | Active |

---

## 9. SEO & TECHNICAL MARKETING

### 9.1 SEO Features Implemented

| Feature | Status |
|---------|--------|
| React Helmet Async (meta tags on all pages) | Active |
| JSON-LD Schema (Product, FAQPage, LocalBusiness) | Active |
| Dynamic Sitemap XML (520 URLs, auto-generated) | Active |
| Backend Prerendering for non-JS crawlers | Active |
| robots.txt with sitemap reference | Active |
| llms.txt for AI crawlers | Active |
| District pages with FAQ schema | Active |
| Product canonical URLs | Active |

### 9.2 Sitemap Coverage

| Section | URLs |
|---------|------|
| Main pages (home, about, contact, catalog) | 5 |
| Catalog divisions (13 divisions + review) | 15 |
| District pages (33 districts) | ~33 |
| Product pages (all catalog products) | ~467 |
| **Total** | **~520** |

### 9.3 Tracking & Analytics

| Tracker | ID | Status |
|---------|----|--------|
| Google Analytics 4 | G-MXXC41JFLG | Active |
| Google Tag | GT-WVGNRQWT | Active |
| Meta/Facebook Pixel | (pending) | Placeholder |

### 9.4 GDPR Compliance

- Cookie Consent Banner with default-deny tracking
- Tracking scripts only fire after user consent
- Cookie banner hidden on admin pages

---

## 10. ADMIN DASHBOARD

### 10.1 Pages & Features

| Page | Features | Lines of Code |
|------|----------|---------------|
| **Dashboard** | Stats overview (products, leads, hot/warm/cold) | 111 |
| **Analytics** | 6 tabs: CRM Leads, Territory, Hospitals, Competitive Intel, Search Intelligence, WhatsApp | 1,115 |
| **Pipeline** | Kanban board (6 stages), drag-and-drop leads | 229 |
| **Leads** | Lead list, search, filter, score, status | 257 |
| **Products** | Product management, search, filter, bulk operations | 613 |
| **WhatsApp** | Inbox, Templates, Analytics, Contact Sync (4 tabs) | 798 |
| **Bulk Upload** | CSV/Excel product upload with validation | 480 |
| **Imports** | PDF brochure import and extraction | 458 |
| **Review** | Product review dashboard with auto-promote | 1,228 |
| **Login** | Admin authentication (SHA-256 hash) | 74 |

### 10.2 Analytics Dashboard Tabs

| Tab | Data Source | Key Metrics |
|-----|-----------|-------------|
| CRM Leads | /api/admin/analytics | Funnel, score distribution, source breakdown |
| Territory | /api/geo/territory-penetration | 4 zones, 1,891 accounts, penetration % |
| Hospitals | /api/geo/hospital-intelligence | 19 hospitals, upsell opportunities |
| Competitive Intel | /api/geo/competitive-intelligence | 24 competitors tracked |
| Search Intelligence | /api/chatbot/telemetry/report | 67 queries, confidence distribution |
| WhatsApp | /api/admin/whatsapp/analytics | Conversations, delivery, campaigns |

---

## 11. API ENDPOINTS (117 Total)

### 11.1 Route File Summary

| Route File | Endpoints | Purpose |
|------------|-----------|---------|
| admin.py | 18 | CRM, pipeline, analytics, leads, stats |
| whatsapp.py | 14 | Webhook, inbox, templates, contact sync |
| public.py | 12 | Public API (leads, contact forms) |
| review.py | 11 | Product review & auto-promote pipeline |
| chatbot.py | 9 | AI chatbot conversations & telemetry |
| catalog.py | 8 | Public catalog browsing |
| geo.py | 8 | Territory, hospitals, competitive intel |
| bulk_upload.py | 7 | CSV/Excel bulk product upload |
| imports.py | 7 | PDF brochure import |
| automation.py | 5 | Lead scoring, follow-ups |
| image_extract.py | 4 | Image extraction from PDFs |
| prerender.py | 4 | SSR/prerender for SEO bots |
| seo.py | 4 | robots.txt, sitemap.xml, llms.txt |
| chat.py | 4 | General chat functionality |
| email.py | 2 | Email tracking |

### 11.2 Key API Endpoints

**Authentication:**
- `POST /api/admin/login` — Admin login (SHA-256 hash)
- `GET /api/admin/verify-token` — JWT token validation

**CRM:**
- `GET /api/admin/stats` — Dashboard overview
- `GET /api/admin/pipeline` — Kanban pipeline data
- `GET /api/admin/analytics` — Full analytics
- `GET /api/admin/leads` — Lead list with filters
- `POST /api/admin/automation/rescore-leads` — Re-score all leads

**WhatsApp:**
- `POST /api/webhook/whatsapp` — Interakt webhook receiver
- `GET /api/admin/whatsapp/conversations` — Inbox
- `POST /api/admin/whatsapp/fetch-interakt-contacts` — Pull contacts from Interakt
- `POST /api/admin/whatsapp/sync-interakt-to-crm` — Sync contacts to CRM

**Catalog:**
- `GET /api/catalog/divisions` — All divisions
- `GET /api/catalog/divisions/{slug}` — Division products
- `GET /api/catalog/products/{slug}` — Product detail

**SEO:**
- `GET /api/sitemap.xml` — Dynamic sitemap (520 URLs)
- `GET /api/seo/robots.txt` — robots.txt
- `GET /api/prerender/*` — SSR HTML for crawlers

**Intelligence:**
- `GET /api/geo/territory-penetration` — Territory analytics
- `GET /api/geo/hospital-intelligence` — Hospital mapping
- `GET /api/geo/competitive-intelligence` — Competitor tracking
- `GET /api/chatbot/telemetry/report` — Search query analytics

---

## 12. FRONTEND PAGES (24 Pages)

### 12.1 Public Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with hero, divisions, CTA |
| Catalog Index | `/catalog` | Browse all 13 divisions |
| Catalog Division | `/catalog/:division` | Products by division |
| Product Detail | `/catalog/products/:slug` | Full product specs |
| Product Compare | `/catalog/compare` | Side-by-side comparison |
| Product Family | `/catalog/family/:family` | Family grouping view |
| Districts Index | `/districts` | All 33 Telangana districts |
| District Page | `/districts/:slug` | District-specific service page |
| About | `/about` | Company information |
| Contact | `/contact` | Contact form + lead capture |
| Chat | `/chat` | AI chatbot interface |

### 12.2 Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/admin/login` | Admin authentication |
| Dashboard | `/admin` | Overview stats |
| Analytics | `/admin/analytics` | 6-tab analytics |
| Pipeline | `/admin/pipeline` | Kanban CRM |
| Leads | `/admin/leads` | Lead management |
| Products | `/admin/products` | Product management |
| WhatsApp | `/admin/whatsapp` | 4-tab WhatsApp management |
| Bulk Upload | `/admin/bulk-upload` | CSV/Excel import |
| Imports | `/admin/imports` | PDF brochure import |
| Review | `/admin/review` | Product review & promote |

---

## 13. SECURITY

| Feature | Implementation |
|---------|---------------|
| Admin Authentication | JWT + SHA-256 hardcoded hash fallback |
| Admin Auth Guard | AdminLayout.jsx validates token before rendering |
| XSS Protection | DOMPurify on all dangerouslySetInnerHTML |
| GDPR Cookie Consent | Default-deny, consent-gated tracking |
| API Authorization | Bearer token on all /api/admin/* endpoints |
| Input Sanitization | Server-side validation on all POST endpoints |
| Webhook Signature | Interakt signature verification (logged) |

---

## 14. THIRD-PARTY INTEGRATIONS

| Service | Purpose | Status |
|---------|---------|--------|
| **Interakt** | WhatsApp Business API (webhook + send messages + contact sync) | Active |
| **OpenAI** | AI chatbot for product queries | Active |
| **Google Analytics 4** | Website analytics (G-MXXC41JFLG) | Active |
| **Google Tag** | Conversion tracking (GT-WVGNRQWT) | Active |
| **Meta Pixel** | Facebook conversion tracking | Pending (placeholder) |

---

## 15. CODEBASE METRICS

| Metric | Value |
|--------|-------|
| Backend Python (excl. archives) | 22,428 lines |
| Frontend React/JSX | 15,502 lines |
| **Total Production Code** | **~37,930 lines** |
| Backend Route Files | 17 |
| API Endpoints | 117 |
| Frontend Pages | 24 |
| Frontend Components | 55 |
| Archived Scripts | 43 |
| npm Dependencies | 57 |
| MongoDB Collections | 44 |
| Total Database Documents | 31,636 |

---

## 16. WHAT'S BEEN COMPLETED (Chronological)

| Phase | Features |
|-------|----------|
| **Foundation** | React + FastAPI + MongoDB setup, product catalog, admin dashboard |
| **Catalog Engine** | PDF import, shadow products, review pipeline, auto-promote, 1,202 live products |
| **CRM** | Lead capture, scoring, pipeline, territory analytics, hospital intelligence |
| **WhatsApp** | Webhook integration, AI bot, campaign tracking, contact sync (1,261 contacts pulled) |
| **SEO** | React Helmet, JSON-LD schemas, sitemap.xml, prerendering, district pages with FAQ |
| **Security** | GDPR cookie consent, XSS protection (DOMPurify), admin auth guard |
| **Code Quality** | Circular import fix, mutable defaults, empty catches, MD5→SHA256, test cleanup |
| **Intelligence** | Chatbot telemetry, search analytics, competitive tracking, visitor insights |

---

## 17. PENDING / UPCOMING

### 17.1 Immediate (Blocked)

| Item | Blocker |
|------|---------|
| Meta Pixel integration | Awaiting Facebook Pixel ID from user |
| Sitemap 520 error on deployed site | Needs redeployment with latest code |

### 17.2 Planned — Product Knowledge Graph

| Phase | Feature | Effort |
|-------|---------|--------|
| Phase 1 | Relationship mining (REQUIRES/BUNDLE/REORDER) | 1 session |
| Phase 2 | CRM cross-sell widget + product page recommendations | 1 session |
| Phase 3 | Consumable reorder engine + WhatsApp alerts | 1 session |

*(Detailed plan in PRODUCT_KNOWLEDGE_GRAPH_REPORT.md)*

### 17.3 Future / Backlog

| Feature | Priority |
|---------|----------|
| Reorder prediction based on consumption patterns | P1 |
| WhatsApp/Email opt-in consent management | P2 |
| Automated quotation PDF generation | P2 |
| Surgeon preference learning | P3 |
| Cross-division intelligence | P3 |
| AI PDF extraction for product specs | P3 |

---

## 18. KEY CREDENTIALS

| System | Credential |
|--------|-----------|
| Admin Login | Password: `AgileHealth2026admin` |
| Interakt API | Key in backend/.env |
| OpenAI | Key in backend/.env |
| Google Analytics | G-MXXC41JFLG |
| Google Tag | GT-WVGNRQWT |

---

*Report generated: March 30, 2026*
*Platform: Agile Healthcare CRM*
*Domain: agileortho.in*
*Total codebase: ~37,930 lines across 96 files*
*Database: 31,636 documents across 44 collections*
