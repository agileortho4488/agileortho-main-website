# MedDevice Pro — Product Requirements Document

## Project Overview
**Name:** MedDevice Pro — B2B Medical Device Master Franchise Platform
**Client:** Premier Meril Life Sciences distributor in Telangana, India
**Stack:** React 19 + FastAPI + MongoDB + Claude AI
**URL:** https://clinical-product-hub.preview.emergentagent.com

## Core Requirements
1. Portfolio showcase website with hierarchical mega-menu (8 divisions)
2. Custom CRM with lead scoring engine
3. Claude AI PDF catalog importer (Phase 3)
4. RAG AI chatbot (Phase 4)
5. WhatsApp integration via Interakt (Phase 5)
6. SEO optimization (Phase 6)

## What's Implemented

### Phase 1: Foundation & Portfolio (COMPLETE - Dec 2025)
- **Backend:** FastAPI + MongoDB with Products CRUD, Leads API, Admin JWT auth, Dashboard stats
- **Database:** 45+ Meril products seeded across 8 divisions
- **Lead Scoring:** Auto-scoring engine (Hot/Warm/Cold)
- **Frontend:** React 19 + Tailwind CSS + Shadcn UI
  - Homepage, Product listing (grid/list), Product Detail, About, Contact
  - Admin login, dashboard, leads CRM, products management
- **Navigation:** Mega-menu with 8 divisions and sub-categories
- **Footer:** MD-42 License, GST, ISO 13485 certification
- **Testing:** 100% pass rate

### Phase 2: Enhanced CRM (COMPLETE - Dec 2025)
- **Kanban Pipeline:** 6-column drag-and-drop board
- **CRM Analytics:** Conversion funnel, score distribution, leads by source
- **Product Create/Edit:** Full form drawer
- **Demo Data:** 12 realistic leads seeded
- **Testing:** 100% pass rate

### Phase 3: Claude AI PDF Importer (COMPLETE - Dec 2025)
- **PDF Upload → Claude AI Extraction → SEO Generation → Admin Approval**
- **Deduplication:** SKU-based exact match + name similarity check
- **Testing:** 100% pass rate

### Product Detail Page Redesign (COMPLETE - Feb 2026)
Based on Agile Ortho reference page analysis + B2B medical device best practices research:
- **Hero:** Side-by-side layout — product image (left, sticky) + product info (right)
- **Social Share:** WhatsApp, LinkedIn, Email, Copy Link buttons
- **Product Tags:** Division, category, material as clickable chips below image
- **Key Features:** Technical specs displayed as bullet points with green checkmarks
- **CTAs:** Request Bulk Quote (modal), WhatsApp Enquiry, Call Sales Team, Request Datasheet
- **Trust Badges:** ISO 13485, CE Mark, CDSCO Approved, Authorized Distributor (with sub-labels)
- **Quote Form:** Modal overlay with dark header, form validation, lead creation
- **Tabbed Content:**
  - Overview: Description, Key Features (2-col grid), Applications, Product Details grid
  - Specifications: Formal table with dark navy header, zebra stripes, merged meta + specs
  - Sizes & Variants: Disabled when no sizes available
- **Help Banner:** Dark navy CTA with "Need Technical Assistance?" + Call Now / Contact Specialist
- **Related Products:** "You May Also Like" section showing up to 4 products from same division
- **Testing:** 100% pass rate (11 backend + 27 frontend tests)

## Product Divisions (45+ products)
1. Orthopedics (6) — Knee/Hip arthroplasty
2. Trauma (6) — Plating, nailing, screws
3. Cardiovascular (6) — Stents, valves, scaffolds
4. Diagnostics (6) — Analyzers, rapid tests, ELISA
5. ENT (5) — Sinus, RF, laser, otoscope
6. Endo-surgical (6) — Sutures, staplers, robotics
7. Infection Prevention (6) — Gowns, disinfection, wound care
8. Peripheral Intervention (4) — Stents, balloons, closure

## Lead Scoring Algorithm
- Bulk Quote inquiry: +40 pts
- Hospital provided: +15 pts
- Email provided: +10 pts
- District provided: +10 pts
- Product interest: +15 pts
- Score >= 60: Hot | 35-59: Warm | <35: Cold

## Credentials
- Admin: admin@meril.dev / admin

## Remaining Phases

### Phase 4: RAG AI Chatbot (P0 - Next)
- Vector knowledge base from product catalog
- Chat widget on website
- System prompt engineering
- Human handoff to CRM

### Phase 5: WhatsApp via Interakt (P1)
- Webhook integration
- AI chatbot on WhatsApp
- Unified inbox in CRM

### Phase 6: SEO & Polish (P2)
- React Helmet meta tags
- JSON-LD structured data
- District landing pages
- Performance optimization

## Backlog
- Product image uploads via object storage
- Product comparison feature
- "Re-extract" button for failed PDF imports
- Backend refactoring (break monolithic server.py into routers/models/services)
- MongoDB → PostgreSQL migration (if required by user)
