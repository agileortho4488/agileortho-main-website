# Agile Ortho — Product Requirements Document

## Project Overview
**Name:** Agile Ortho — B2B Medical Device Platform
**Company:** AGILE ORTHOPEDICS PRIVATE LIMITED
**Domain:** www.agileortho.in
**Stack:** React 19 + FastAPI + MongoDB + Claude AI + Interakt WhatsApp
**GST:** 36AATCA5653R1ZO

## Core Identity
- **Brand:** Agile Ortho
- **Tagline:** Mobility Revolutionised
- **Role:** Authorized Meril Life Sciences Master Distributor for Telangana
- **Phone:** +917416216262
- **WhatsApp:** +917416521222
- **Email:** info@agileortho.in
- **Address:** 1st Floor, Plot No 26, H.No 8-6-11/P20, Urmila Devi Complex, Engineers Colony, Hayathnagar, Hyderabad, Telangana - 500074
- **Shop:** https://www.agileortho.shop

## What's Implemented

### Phase 1: Foundation & Portfolio (COMPLETE)
- Backend: FastAPI + MongoDB, Products CRUD, Leads API, Admin JWT auth
- Frontend: React 19 + Tailwind CSS + Shadcn UI
- Admin: Login, dashboard, leads CRM, products management

### Phase 2: Enhanced CRM (COMPLETE)
- Kanban Pipeline, CRM Analytics, Product Create/Edit

### Phase 3: Claude AI PDF Importer (COMPLETE)
- PDF Upload -> Claude AI Extraction -> Admin Approval
- OCR support via pdfplumber, PyMuPDF, pdf2image, pytesseract
- Claude Vision fallback for image-based PDFs
- PPTX file extraction support (python-pptx)
- Reprocess endpoint for failed imports

### Phase 4: RAG AI Chatbot (COMPLETE)
- Claude Sonnet RAG with 300+ product knowledge base
- Floating widget + dedicated /chat page
- Session management, lead capture

### Phase 5: Interakt WhatsApp Integration (COMPLETE — FULLY ENHANCED)
- Webhook with HMAC SHA256 signature verification
- All Interakt event types handled
- Template messaging, contact sync, event tracking
- WhatsApp analytics dashboard
- Auto-sync new leads to Interakt

### Product Catalog (306 PRODUCTS — 13 DIVISIONS)
| Division | Count |
|---|---|
| Diagnostics | 84 |
| Infection Prevention | 72 |
| Trauma | 37 |
| ENT | 30 |
| Orthopedics | 28 |
| Cardiovascular | 21 |
| Endo-surgical | 16 |
| Peripheral Intervention | 6 |
| Cardiac Surgery | 6 |
| Others (Dental, Critical Care, Robotics, Sport Medicine) | 6 |
| **Total** | **306** |

### Data Sources
- Initial seed: 45 products
- Brochure imports (Phase 3): 44 products from user PDFs
- Google Drive batch 1 (40 PDFs): ~134 products
- PPTX files (5 files): 17 ENT products
- Google Drive batch 2 (58 PDFs): 66 products

### GA4 Analytics (COMPLETE)
- Measurement ID: G-MXXC41JFLG

## Credentials
- Admin Password: admin
- Interakt API Key: configured in .env
- Interakt Webhook Secret: configured in .env

## Remaining Tasks

### Phase 6: SEO & Polish (P1)
- React Helmet meta tags per page
- JSON-LD structured data
- District landing pages

### Backlog
- Meril website-inspired homepage redesign (merillife.com reference)
- Product image uploads via object storage
- Product comparison feature
- Backend refactoring (break monolithic server.py)
- Download remaining brochures from Google Drive (Ortho Hip/Knee, Vascular detailed)
- Process image-only PDFs (2 remaining failed)
