# Agile Healthcare — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for Agile Healthcare, the Meril Life Sciences master franchise for ALL of Telangana, India. Full catalog, AI chatbot, WhatsApp integration, CRM/Lead scoring, zone-based territory analytics, competitive intelligence, and self-learning chatbot. SEO-optimized for search engines and AI crawlers.

## Architecture
- **Frontend**: React (CRA) + Tailwind + Shadcn UI + Framer Motion + react-helmet-async
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **WhatsApp**: Interakt API
- **Email**: Zoho SMTP (smtppro.zoho.in)
- **Geolocation**: ip-api.com
- **Tracking**: Meta Pixel + Google Analytics 4
- **SEO**: JSON-LD (MedicalBusiness + FAQ), sitemap.xml, robots.txt, llms.txt, react-helmet-async

## Admin Dashboard (6 tabs)
1. CRM Leads — Funnel, product demand intelligence, recent leads with product interests
2. Territory — All 4 zones, penetration %, marketing gaps
3. Hospitals — Multi-department engagement, upsell opportunities
4. Competitive Intel — 24 tracked brands, division threats
5. Search Intelligence — Chatbot queries, confidence
6. WhatsApp — Conversations, delivery, nurture pipeline stats

## What's Been Implemented

### SEO Overhaul — Mar 30, 2026
- **index.html**: Full meta tags (title, description, OG, Twitter, geo, canonical), 2 JSON-LD schemas (MedicalBusiness + FAQ), noscript fallback with full content for crawlers
- **Static Files**: robots.txt (allows all bots + AI crawlers), sitemap.xml (20 URLs), llms.txt
- **Heading Hierarchy**: H1 "Meril Medical Devices for Hyderabad & Telangana", H2s with local keywords
- **Branding**: All "Agile Ortho" references → "Agile Healthcare"
- **SEO Component**: react-helmet-async for dynamic page-level meta tags

### Admin Login Fix — Mar 30, 2026
- Changed password to `AgileHealth2026admin` (no special chars)
- Added SHA-256 hash fallback in code (works regardless of env var state)
- Added show/hide password toggle
- Added DB-stored hash as tertiary fallback

### Self-Learning Chatbot Engine — Mar 29, 2026
- Background engine analyzing conversations, enriching leads with product insights
- FAQ cache for smarter chatbot responses

### Hospital Intelligence + Competitive Intelligence — Mar 29, 2026
### Territory Dashboard + Marketing Integrations — Mar 29, 2026
### Core Platform — Earlier dates

## Admin Password
`AgileHealth2026admin` (3-layer auth: env var → hardcoded hash → DB hash)

## Pending Items
- **P0**: Replace Meta Pixel PIXEL_ID_PLACEHOLDER with actual Pixel ID
- **P0**: Replace Google Ads Conversion ID placeholder
- **P0**: Configure Cloudflare to whitelist Googlebot, GPTBot, ClaudeBot
- **P1**: Submit sitemap.xml to Google Search Console
- **P1**: Manual review of blockers via Admin Review Dashboard
- **P2**: Consent management, archive legacy scripts

## Future/Backlog
- Reorder prediction
- Product individual URL pages with unique crawlable routes
- Service areas page with district-specific content
