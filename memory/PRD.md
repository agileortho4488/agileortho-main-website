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
- **SEO**: JSON-LD (MedicalBusiness + FAQ + Product + BreadcrumbList + ItemList), dynamic sitemap.xml, robots.txt, llms.txt, react-helmet-async

## Admin Dashboard (6 tabs)
1. CRM Leads — Funnel, product demand intelligence, recent leads with product interests
2. Territory — All 4 zones, penetration %, marketing gaps
3. Hospitals — Multi-department engagement, upsell opportunities
4. Competitive Intel — 24 tracked brands, division threats
5. Search Intelligence — Chatbot queries, confidence
6. WhatsApp — Conversations, delivery, nurture pipeline stats

## What's Been Implemented

### Advanced SEO Implementation — Mar 30, 2026
- **Catalog SEO**: All catalog pages (Index, Division, Product Detail, Compare) now have dedicated SEO via react-helmet-async
- **Product JSON-LD**: Each product page injects Product schema with brand, material, manufacturer, SKU, and offer details
- **BreadcrumbList**: Full breadcrumb schema on all catalog pages for search result snippets
- **ItemList Schema**: Division and catalog index pages include ItemList for product discovery
- **Descriptive Alt Texts**: All product images have rich alt text including product name, brand, division, and material
- **Canonical URLs**: Each page has a unique canonical URL (e.g., `/catalog/products/mboss-screw-system`)
- **OG Tags**: Product pages use `og:type=product`, with product-specific title/description/image
- **Dynamic Sitemap**: `/api/seo/sitemap.xml` dynamically includes 500+ product URLs, division pages, and district pages
- **Deduplication**: Removed static meta tags from index.html that caused duplicates with Helmet; Helmet is sole source of truth
- **robots.txt**: Updated to point to dynamic sitemap at `/api/seo/sitemap.xml`
- **noIndex**: Compare page marked as noindex to prevent crawling

### Foundational SEO Overhaul — Mar 30, 2026
- **index.html**: JSON-LD schemas (MedicalBusiness + FAQ), noscript fallback with full content for crawlers
- **Static Files**: robots.txt (allows all bots + AI crawlers), llms.txt
- **Heading Hierarchy**: H1 "Meril Medical Devices for Hyderabad & Telangana", H2s with local keywords
- **SEO Component**: react-helmet-async for dynamic page-level meta tags

### Admin Login Fix — Mar 30, 2026
- Changed password to `AgileHealth2026admin` (no special chars)
- Added SHA-256 hash fallback in code (works regardless of env var state)

### Self-Learning Chatbot Engine — Mar 29, 2026
- Background engine analyzing conversations, enriching leads with product insights

### Hospital Intelligence + Competitive Intelligence — Mar 29, 2026
### Territory Dashboard + Marketing Integrations — Mar 29, 2026
### Core Platform — Earlier dates

## Admin Password
`AgileHealth2026admin` (3-layer auth: env var -> hardcoded hash -> DB hash)

## Pending Items
- **P0**: Replace Meta Pixel PIXEL_ID_PLACEHOLDER with actual Pixel ID
- **P0**: Replace Google Ads Conversion ID placeholder
- **P0**: Configure Cloudflare to whitelist Googlebot, GPTBot, ClaudeBot
- **P1**: Submit sitemap.xml to Google Search Console
- **P1**: Service areas page with district-specific content (for Local SEO)
- **P2**: Consent management, archive legacy scripts

## Future/Backlog
- Reorder prediction based on consumption patterns
- SSR/Prerendering for non-JS crawlers (complete SPA SEO fix)
- File 008 processing (awaiting uncorrupted DOCX)
