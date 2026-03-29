# Agile Healthcare — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for Agile Healthcare, the Meril Life Sciences master franchise for ALL of Telangana, India. The platform provides a clinically grouped product catalog across ALL 13 Meril divisions, with AI Chatbot, WhatsApp integration, CRM/Lead scoring, zone-based territory analytics, and Admin Dashboard.

## Architecture
- **Frontend**: React (CRA) + Tailwind + Shadcn UI + Framer Motion
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB (catalog_products, catalog_skus, leads, visitor_events, zones, wa_conversations, chatbot_telemetry)
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **WhatsApp**: Interakt API
- **Geolocation**: ip-api.com (free tier)
- **Design**: Dark Premium — Outfit font, gold (#D4AF37) + teal (#2DD4BF) on obsidian (#0A0A0A)

## Telangana Market Structure
### Hyderabad Metro (4 Zones — ALL Agile Healthcare)
- Zone 01 (Kukatpally): 365 accounts, 209 hospitals, 156 labs
- Zone 02 (Ameerpet/Hitech City): 413 accounts, 276 hospitals, 138 labs — PRIMARY
- Zone 03 (Central/Old City): 379 accounts, 226 hospitals, 153 labs
- Zone 04 (Dilsukhnagar/Secunderabad): 734 accounts, 430 hospitals, 304 labs
- **Total Metro: 1,891 accounts**
### 33 Districts — Full Telangana coverage

### 13 Meril Divisions (ALL Equal Priority)
Trauma, Joints/Arthroplasty, Spine, Cardiology, Endosurgery, Endo, ENT, Diagnostics, Vascular, Consumables, Sports Medicine, Dental, Orthobiologics

## What's Been Implemented

### Zone/Territory + IP Geolocation + Lead Intelligence — Mar 29, 2026
- **IP Geolocation**: Auto-detect visitor's city/zone from IP on page load (ip-api.com)
- **4-Zone Hyderabad Mapping**: 130+ localities mapped to zones, coordinate-based fallback
- **Equal Department Scoring**: ALL 13 divisions score equally (25pts) — no bias toward Ortho
- **Lead Auto-Scoring** (0-100): Department + inquiry type + hospital + email + product interest
- **Auto-Routing**: All leads → "Agile Healthcare" (removed Arka/Medisun/Pride)
- **Visitor Event Tracking**: page_view, search, product_view events tagged with zone/district
- **Territory Penetration API**: District × Division matrix, zero-lead districts, division gaps (cross-sell)
- **Zone Analytics API**: Leads/score/hot-warm-cold per zone, top departments, top products
- **Visitor Insights API**: Top searches by zone, visits by zone, top pages
- **Auto-fill District**: LeadCaptureModal pre-fills district from IP geolocation

### Framer Motion Animations — Mar 28, 2026
- Page transitions, scroll-triggered section animations, modal animations, dropdown animations

### Universal Lead Capture System — Mar 28, 2026
- LeadCaptureModal on ALL WhatsApp/enquiry touchpoints
- Captures: Name, Hospital, Department, Phone, Email, District
- 16 department options covering all Meril divisions

### UX Audit + Dark Premium Theme — Mar 28, 2026
- Agile Healthcare branding, WhatsApp dropdown, consolidated CTAs, 4-column footer

### Core Platform
- 810+ products, 13 divisions, AI chatbot, Admin CRM, 3-tab analytics, auto-seed

## Key API Endpoints
- `GET /api/geo/detect` — IP geolocation
- `POST /api/geo/track` — Visitor event tracking
- `GET /api/geo/zones` — Zone data with lead counts
- `GET /api/geo/zone-analytics` — Zone-level CRM analytics
- `GET /api/geo/territory-penetration` — District × Division penetration
- `GET /api/geo/visitor-insights` — Search/visit analytics

## Pending Items
- **P0**: Upgrade existing CRM dashboard tabs with zone filters, lead scores, territory data
- **P1**: Automated WhatsApp nurture sequences via Interakt templates
- **P1**: Meta Pixel + Google Ads conversion tracking tags
- **P2**: Zoho email integration for catalog PDF delivery
- **P2**: Consent management (opt-in/opt-out)
- **P2**: Archive legacy phase scripts

## Known Constraints
- ip-api.com free tier: 45 requests/min (sufficient for B2B traffic)
- WhatsApp free-form replies only within 24h
- Emergent LLM Key budget — avoid batch LLM scripts
