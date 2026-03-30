# Agile Healthcare — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for Agile Healthcare, the Meril Life Sciences master franchise for ALL of Telangana, India. Full catalog, AI chatbot, WhatsApp integration, CRM/Lead scoring, zone-based territory analytics, competitive intelligence, and self-learning chatbot. SEO-optimized for search engines and AI crawlers.

## Architecture
- **Frontend**: React (CRA) + Tailwind + Shadcn UI + Framer Motion + react-helmet-async
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **WhatsApp**: Interakt API (webhook at /api/webhook/whatsapp)
- **Email**: Zoho SMTP (smtppro.zoho.in)
- **Geolocation**: ip-api.com
- **Tracking**: Meta Pixel + GA4 (consent-gated via cookie banner)
- **SEO**: JSON-LD schemas, dynamic sitemap, prerender service, FAQPage schema, react-helmet-async

## Admin Dashboard (6 tabs)
1. CRM Leads — Funnel, product demand intelligence
2. Territory — 4 zones, penetration %, marketing gaps
3. Hospitals — Multi-department engagement, upsell
4. Competitive Intel — 24 tracked brands, division threats
5. Search Intelligence — Chatbot queries, confidence
6. WhatsApp — Conversations (11 total, 57 msgs), delivery stats, webhook logs

## What's Been Implemented (This Session)

### Server-Side Prerender Service — Mar 30, 2026
- Backend prerender at `/api/prerender/*` for non-JS crawlers
- Endpoints: `/api/prerender/product/:slug`, `/api/prerender/catalog`, `/api/prerender/catalog/:division`, `/api/prerender/district/:slug`
- Returns full HTML with meta tags, JSON-LD schemas, and actual DB content
- Product pages include specs, SKUs, breadcrumbs, Product schema
- User should configure nginx/Cloudflare to proxy bot user-agents through prerender

### District Pages Enhanced — Mar 30, 2026
- Added FAQ section with 4 district-specific questions per page
- FAQPage JSON-LD schema for Google rich results (FAQ snippets)
- Questions cover: authorized distributor, available devices, hospitals served, ordering process
- Expandable `<details>/<summary>` elements for UX

### Cookie Consent Banner — Mar 30, 2026
- GDPR-style banner with Accept/Reject, GA4 + Meta Pixel consent-gated

### Advanced SEO — Mar 30, 2026
- Product/BreadcrumbList/ItemList/FAQPage schemas across all catalog & district pages
- Descriptive image alt texts, unique canonicals, dynamic sitemap (520+ URLs)

### Backend Cleanup — Mar 30, 2026
- 47 legacy scripts archived to `/backend/scripts/archive/`

## WhatsApp Integration Status
- Interakt webhook is ACTIVE — 21 webhook logs received
- 11 conversations synced, 57 total messages
- Delivery rate: 30% (3 failed = likely test phone numbers)
- Signature validation: shows False (webhook secret may need updating in Interakt dashboard)
- All event types handled: message_received, sent, delivered, read, failed, clicked

## Admin Password
`AgileHealth2026admin` (hardcoded SHA-256 hash — DO NOT revert to env var)

## Pending Items
- **P0**: Replace Meta Pixel `PIXEL_ID_PLACEHOLDER` with actual Pixel ID (user provides later)
- **P0**: Replace Google Ads Conversion ID placeholder (user provides later)
- **P1**: Configure nginx/Cloudflare bot routing to prerender endpoints
- **P1**: Submit dynamic sitemap to Google Search Console
- **P1**: Update Interakt webhook secret to fix signature validation

## Future/Backlog
- Reorder prediction based on consumption patterns
- Consent management for WhatsApp/email (opt-in/opt-out)
- File 008 processing (awaiting uncorrupted DOCX)
