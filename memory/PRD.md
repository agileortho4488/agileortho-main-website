# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for Agile Ortho, a premier Meril Life Sciences master franchise in Telangana, India. The platform provides a standardized, clinically grouped product catalog mapped to exact manufacturer SKUs, with an AI Chatbot (web + WhatsApp via Interakt), and a secure Admin Dashboard.

## Architecture
- **Frontend**: React (CRA) + Tailwind + Shadcn UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB (`catalog_products`, `catalog_skus`, `wa_conversations`, `chatbot_telemetry`, `leads`)
- **AI**: Claude Sonnet 4.5 via `emergentintegrations` (Emergent LLM Key)
- **WhatsApp**: Interakt API (webhook + outbound messaging)

## What's Been Implemented

### Core Platform
- Responsive homepage with 13 medical divisions, featured products, district coverage
- Full catalog browsing: `/catalog` → `/catalog/{division-slug}` → `/catalog/products/{slug}`
- Global product search across 810 production-eligible products
- SEO-optimized product detail pages with specifications, SKU codes, brochure links

### AI Chatbot (Web + WhatsApp)
- Web chatbot widget with product search, SKU lookup, brand queries
- Greeting detection for casual messages (hi, hello, hey, etc.)
- WhatsApp webhook via Interakt — full conversation pipeline:
  - Incoming message → AI response → outbound reply (within 24h window)
  - Welcome message for new users
  - Message chunking for WhatsApp-friendly lengths
  - Human takeover mode (admin can pause AI, reply manually)
  - Auto lead creation and scoring
  - Delivery tracking (sent/delivered/read/failed)

### Admin Dashboard
- Product management (1202 catalog products across 14 canonical divisions)
- Lead CRM with scoring and follow-up automation
- WhatsApp conversation management (view, takeover, reply)
- 4-Lane Auto-Promotion pipeline (cleared 505 products automatically)
- Review dashboard for 65 remaining true blockers
- **Enhanced Analytics (3 tabs)**:
  - CRM Leads: funnel, scores, sources, districts, inquiry types
  - Search Intelligence: top doctor queries, confidence breakdown, unmatched searches (inventory gaps), SKU lookups, off-topic rate, handoff metrics
  - WhatsApp: conversations, delivery stats, read rates, templates

### Data Pipeline
- Enriched catalog from legacy product data via AI classification
- 810 production-eligible products (live_visible=true, review_required=false)
- 13 divisions with canonical naming
- Full system cutover: all public APIs use `catalog_products_col` (no legacy dependencies)

### Staff Contact Numbers (Configured in AI Bots)
- Dispatch & Delivery: 7416818183
- Orthopedics & Spine: 7416162350
- General Queries: 7416216262
- Consumables: 7416416871
- Billing & Finance: 7416416093
- WhatsApp Sales: 7416521222

## Deployment Configuration
- **Interakt API Key**: Configured in backend/.env
- **Webhook Secret**: `1dc24700-25aa-4262-be11-1e64a38be99f`
- **Production Webhook URL**: `https://www.agileortho.in/api/webhook/whatsapp`
- **WhatsApp Business Number**: +917416521222
- **Rate Limit**: 600 requests/minute on Interakt API

## Pending Items
- **P0**: Manual review of 65 true blockers (conflicts, weak evidence) via Admin Review Dashboard
- **P2**: Archive legacy phase scripts to `scripts/archive/`
- **P3**: File 008 (corrupted DOCX) — blocked, awaiting uncorrupted file

## Known Constraints
- Emergent LLM Key budget was exhausted in prior wave — avoid batch LLM scripts
- WhatsApp free-form replies only work within 24h of customer's last message
- Outside 24h window, only pre-approved Interakt templates can be sent
