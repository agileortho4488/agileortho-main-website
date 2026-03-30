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
- **Tracking**: Meta Pixel + Google Analytics 4 (consent-gated)
- **SEO**: JSON-LD schemas, dynamic sitemap, robots.txt, llms.txt, react-helmet-async

## Admin Dashboard (6 tabs)
1. CRM Leads — Funnel, product demand intelligence, recent leads with product interests
2. Territory — All 4 zones, penetration %, marketing gaps
3. Hospitals — Multi-department engagement, upsell opportunities
4. Competitive Intel — 24 tracked brands, division threats
5. Search Intelligence — Chatbot queries, confidence
6. WhatsApp — Conversations, delivery, nurture pipeline stats

## What's Been Implemented

### Cookie Consent Banner — Mar 30, 2026
- GDPR-style consent banner with "Accept All" / "Reject Non-Essential" / X dismiss
- GA4 consent mode: defaults to `denied`, updates on user choice
- Meta Pixel: `fbq('consent', 'revoke')` by default, grants on accept
- Persists choice in localStorage (`agile_cookie_consent`)
- Dark premium design with slide-up animation, matching site aesthetic

### Advanced SEO Implementation — Mar 30, 2026
- Product JSON-LD, BreadcrumbList, ItemList schemas across all catalog pages
- Descriptive image alt texts (brand, material, division)
- Unique canonical URLs per page, OG type=product on detail pages
- Dynamic sitemap (520 URLs), no duplicate meta tags
- Compare page marked noindex

### Backend Cleanup — Mar 30, 2026
- 47 legacy phase/batch scripts archived to `/backend/scripts/archive/`

### Foundational SEO, Admin Login Fix, Self-Learning Chatbot, Territory Intelligence — Earlier

## Admin Password
`AgileHealth2026admin` (hardcoded SHA-256 hash in admin.py — DO NOT revert to env var)

## Pending Items
- **P0**: Replace Meta Pixel `PIXEL_ID_PLACEHOLDER` with actual Pixel ID (user will provide later)
- **P0**: Replace Google Ads Conversion ID placeholder (user will provide later)
- **P1**: Service areas page enhancement with district-specific content for Local SEO
- **P1**: Submit dynamic sitemap to Google Search Console

## Future/Backlog
- SSR/Prerendering for non-JS crawlers
- Reorder prediction based on consumption patterns
- Consent management for WhatsApp/email (opt-in/opt-out)
- File 008 processing (awaiting uncorrupted DOCX)
