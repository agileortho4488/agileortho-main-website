# B2B Medical Device Platform — Detailed Project Report (DPR)

## 1. Project Overview

**Project Name:** MedDevice Pro — B2B Medical Device Master Franchise Platform
**Client:** Premier Medical Device Master Franchise, Telangana, India
**Platform Type:** B2B Portfolio Website + Custom CRM + AI Sales Agent
**Tech Stack:** React 19 + FastAPI + MongoDB + Claude AI + Interakt WhatsApp API

### 1.1 Business Objectives
- Aggressive lead capture from hospitals, clinics, and distributors across Telangana
- Organic SEO dominance for medical device distribution queries
- Automated client engagement via WhatsApp-first AI chatbot
- Unified CRM for pipeline management without third-party tools

### 1.2 Target Audience
- Hospital procurement managers
- Clinic owners and doctors
- Sub-distributors and dealers
- Surgical equipment buyers in Telangana districts

---

## 2. Tech Stack & Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 19 + Tailwind CSS + Shadcn/UI | SPA with React Router, React Helmet for SEO |
| Backend | FastAPI (Python) | REST API, JWT auth, file processing |
| Database | MongoDB | Products, Leads, Conversations, Admin |
| AI/LLM | Claude (via Emergent Universal Key) | PDF extraction, chatbot, content generation |
| Vector DB | In-memory / MongoDB Atlas Search | RAG knowledge base for chatbot |
| WhatsApp | Interakt API | Webhook-based messaging |
| File Storage | Local / Object Storage | PDF brochures, product images |

### 2.1 Architecture Diagram
```
[Browser] → [React SPA :3000]
                ↓
[Kubernetes Ingress /api/*] → [FastAPI :8001]
                                    ↓
                            [MongoDB] [Claude API] [Interakt API]
```

---

## 3. Database Schema (MongoDB Collections)

### 3.1 Products Collection
```json
{
  "product_name": "String",
  "sku_code": "String (unique)",
  "division": "String (Orthopedics | Infection Prevention | Critical Care | General Surgery | Cardiology | Diagnostics)",
  "category": "String (sub-category within division)",
  "technical_specifications": "Object (JSON — flexible key-value pairs)",
  "size_variables": "Array of Strings",
  "pack_size": "String",
  "material": "String",
  "description": "String (AI-generated, SEO-optimized)",
  "seo_meta_title": "String",
  "seo_meta_description": "String",
  "brochure_url": "String (gated download link)",
  "images": "Array of Strings (URLs)",
  "manufacturer": "String",
  "status": "String (draft | published | archived)",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### 3.2 Leads Collection
```json
{
  "name": "String",
  "hospital_clinic": "String",
  "phone_whatsapp": "String",
  "email": "String",
  "district": "String (Telangana districts)",
  "inquiry_type": "String (Bulk Quote | Product Info | Brochure Download | WhatsApp Chat | General)",
  "source": "String (website | whatsapp | manual)",
  "score": "String (Hot | Warm | Cold)",
  "score_value": "Number (0-100)",
  "notes": "Array of {text, timestamp}",
  "assigned_to": "String",
  "status": "String (new | contacted | qualified | negotiation | won | lost)",
  "whatsapp_conversations": "Array of {message, sender, timestamp}",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### 3.3 Conversations Collection (WhatsApp/Chat)
```json
{
  "lead_id": "String (reference)",
  "channel": "String (website_chat | whatsapp)",
  "messages": "Array of {role, content, timestamp}",
  "ai_handled": "Boolean",
  "escalated": "Boolean",
  "created_at": "DateTime"
}
```

### 3.4 Admin Collection
```json
{
  "username": "String",
  "password_hash": "String",
  "role": "String (super_admin | sales_agent)",
  "created_at": "DateTime"
}
```

### 3.5 PDF Imports Collection
```json
{
  "filename": "String",
  "upload_date": "DateTime",
  "status": "String (processing | completed | failed)",
  "extracted_products": "Array of product drafts",
  "approved_count": "Number",
  "total_count": "Number"
}
```

---

## 4. Phased Implementation Plan

### PHASE 1: Foundation & Portfolio (Core MVP)
**Goal:** Working website with product showcase and basic admin

| # | Task | Priority | Details |
|---|------|----------|---------|
| 1.1 | Clean up deprecated code | P0 | Remove all OrthoConnect files, reset frontend/backend |
| 1.2 | Backend API setup | P0 | FastAPI routes for Products CRUD, Admin auth |
| 1.3 | MongoDB schema & seeding | P0 | Create collections, seed sample products across divisions |
| 1.4 | Design system & theme | P0 | Medical color palette, typography, component tokens |
| 1.5 | Public website — Header & Mega Menu | P0 | Division-based navigation with sub-categories |
| 1.6 | Public website — Home page | P0 | Hero, featured products, trust signals, CTAs |
| 1.7 | Public website — Product listing page | P0 | Filter by division/category, search, grid/list view |
| 1.8 | Public website — Product detail page | P0 | Specs table, sizes, brochure download (gated), related products |
| 1.9 | Public website — Footer | P0 | MD-42 License, GST, contact info, Telangana map |
| 1.10 | Lead capture forms | P0 | "Request Bulk Quote", "Download Brochure" — saves to Leads |
| 1.11 | Admin login & dashboard shell | P1 | JWT auth, sidebar nav, overview stats |

**Testing:** Full backend API tests + frontend smoke test + testing agent

---

### PHASE 2: Custom CRM
**Goal:** Complete lead management system for sales team

| # | Task | Priority | Details |
|---|------|----------|---------|
| 2.1 | Leads CRUD API | P0 | Create, read, update, delete, filter, paginate |
| 2.2 | Lead scoring engine | P0 | Auto-score based on: inquiry type, district, hospital size, engagement |
| 2.3 | CRM Dashboard | P0 | Pipeline view (Kanban), lead table, filters, search |
| 2.4 | Lead detail page | P0 | Full profile, notes, conversation history, status updates |
| 2.5 | CRM Analytics | P1 | Leads by source, district heatmap, conversion funnel |
| 2.6 | Product management (Admin) | P1 | CRUD interface for products, status management |

**Testing:** CRM workflow tests, lead scoring validation, testing agent

---

### PHASE 3: AI Integration — Claude PDF Importer
**Goal:** Auto-extract product data from manufacturer PDFs

| # | Task | Priority | Details |
|---|------|----------|---------|
| 3.1 | PDF upload endpoint | P0 | Accept PDF files, store, track processing status |
| 3.2 | Claude integration | P0 | Send PDF content to Claude, extract structured product data |
| 3.3 | SEO content generation | P0 | Claude generates descriptions, meta titles, meta descriptions |
| 3.4 | Admin approval workflow | P0 | Review extracted products, edit, approve/reject, publish |
| 3.5 | Batch import UI | P1 | Upload multiple PDFs, progress tracking, results summary |

**Testing:** PDF extraction accuracy, approval flow, testing agent

---

### PHASE 4: RAG AI Chatbot
**Goal:** Autonomous AI sales agent on website

| # | Task | Priority | Details |
|---|------|----------|---------|
| 4.1 | Knowledge base builder | P0 | Index all products into vector embeddings |
| 4.2 | RAG pipeline | P0 | Query → vector search → context injection → Claude response |
| 4.3 | Chat widget (frontend) | P0 | Floating chat bubble, conversation UI, typing indicators |
| 4.4 | Chat API (backend) | P0 | Session management, message history, context window |
| 4.5 | System prompt engineering | P0 | Senior technical specialist persona, Telangana context |
| 4.6 | Human handoff logic | P1 | Detect uncertainty → flag in CRM → alert agent |
| 4.7 | Lead auto-capture from chat | P1 | Extract name/phone/hospital from conversation → create lead |

**Testing:** Chatbot accuracy, handoff flow, lead capture, testing agent

---

### PHASE 5: WhatsApp Integration (Interakt)
**Goal:** Bridge AI chatbot to WhatsApp

| # | Task | Priority | Details |
|---|------|----------|---------|
| 5.1 | Interakt webhook setup | P0 | Receive incoming WhatsApp messages |
| 5.2 | Message routing | P0 | Incoming message → RAG AI → response via Interakt API |
| 5.3 | Unified inbox in CRM | P0 | View all WhatsApp conversations alongside website chats |
| 5.4 | Agent takeover | P1 | Manual reply from CRM overrides AI |
| 5.5 | WhatsApp template messages | P1 | Follow-up templates, quote confirmations |

**Testing:** Webhook integration, message flow, CRM inbox, testing agent

---

### PHASE 6: SEO & Polish
**Goal:** Production-ready with SEO optimization

| # | Task | Priority | Details |
|---|------|----------|---------|
| 6.1 | React Helmet meta tags | P1 | Per-page title, description, OG tags |
| 6.2 | Structured data (JSON-LD) | P1 | Product schema, Organization schema, LocalBusiness |
| 6.3 | District landing pages | P2 | Hyper-local pages for each Telangana district |
| 6.4 | Performance optimization | P2 | Image lazy loading, code splitting, caching |
| 6.5 | About / Contact pages | P2 | Company info, warehouse location, team |
| 6.6 | Sitemap generation | P2 | Dynamic XML sitemap for all products/pages |

---

## 5. UI/UX Design Direction

### 5.1 Color Palette
- **Primary:** Deep Navy Blue (#0A2647) — Trust, professionalism
- **Secondary:** Surgical Teal (#2E8B8B) — Medical authority
- **Accent:** Bright White (#FFFFFF) — Clean, clinical
- **CTA:** Emerald Green (#10B981) — Action, growth
- **Warning/Hot:** Amber (#F59E0B)
- **Background:** Cool Gray (#F8FAFC)

### 5.2 Typography
- Headings: Bold, clean sans-serif
- Body: Readable, professional
- Data/Specs: Monospace for technical specifications

### 5.3 Key CTAs
- "Request Bulk Quote" (Primary green)
- "Download Surgical Technique Guide" (Gated)
- "Chat with Specialist on WhatsApp" (WhatsApp green)
- "Call Now" (Phone icon)

### 5.4 Trust Signals (Footer)
- MD-42 Wholesale Drug License Number
- GST Registration Number
- ISO Certification badges
- Warehouse/Office address in Telangana

---

## 6. API Endpoints Plan

### Public APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (filter, search, paginate) |
| GET | /api/products/:id | Product detail |
| GET | /api/divisions | List all divisions with categories |
| POST | /api/leads | Submit lead (quote request, brochure download) |
| POST | /api/chat | Send message to AI chatbot |
| GET | /api/chat/:session_id | Get chat history |

### Admin APIs (JWT Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/login | Admin authentication |
| GET | /api/admin/dashboard/stats | CRM overview statistics |
| GET | /api/admin/leads | List leads (filter, sort, paginate) |
| GET | /api/admin/leads/:id | Lead detail |
| PUT | /api/admin/leads/:id | Update lead |
| DELETE | /api/admin/leads/:id | Delete lead |
| POST | /api/admin/products | Create product |
| PUT | /api/admin/products/:id | Update product |
| DELETE | /api/admin/products/:id | Delete product |
| POST | /api/admin/import/pdf | Upload PDF for extraction |
| GET | /api/admin/import/:id | Get import status & results |
| PUT | /api/admin/import/:id/approve | Approve extracted products |

### Webhook APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/webhook/interakt | Receive WhatsApp messages |

---

## 7. Milestones & Deliverables

| Phase | Deliverable | Status |
|-------|-------------|--------|
| Phase 1 | Working portfolio website with product showcase | NOT STARTED |
| Phase 2 | Custom CRM with lead management | NOT STARTED |
| Phase 3 | AI-powered PDF catalog importer | NOT STARTED |
| Phase 4 | RAG AI chatbot on website | NOT STARTED |
| Phase 5 | WhatsApp integration via Interakt | NOT STARTED |
| Phase 6 | SEO optimization & polish | NOT STARTED |

---

## 8. 3rd Party Integrations Required

| Integration | Purpose | Key Required |
|-------------|---------|-------------|
| Claude (Emergent Universal Key) | PDF extraction, chatbot, SEO content | Emergent LLM Key (available) |
| Interakt | WhatsApp Business API | User must provide API key |
| Object Storage | PDF/image uploads | Via integration playbook |

---

*Last Updated: December 2025*
*Status: Planning Complete — Awaiting User Approval to Begin Phase 1*
