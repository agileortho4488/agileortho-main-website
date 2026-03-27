# Agile Ortho — Product Requirements Document

## Original Problem Statement
Build a B2B medical device platform for a premier medical device master franchise in Telangana, India ("Agile Ortho").
Core requirement: "SKU Intelligence System" — extract 100% of product data from 200 manufacturer brochures. 4-layer architecture feeding a Website Chatbot and WhatsApp AI Chatbot.

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn UI, Manrope font
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **AI**: Claude Sonnet 4.5 via emergentintegrations
- **Storage**: Emergent Object Storage
- **3rd Party**: Interakt WhatsApp API (pending)

## SKU Intelligence Pipeline — COMPLETE
- 523 raw products, 481 normalized, 5107 SKU codes, 97 brands, 13 divisions, 654 training chunks

## Website Chatbot UI — COMPLETE
- Confidence-aware chat, WhatsApp handoff, session tracking, telemetry

## Catalog Taxonomy & Merge (Phase 1 & 2) — COMPLETE
- 6 taxonomy collections, 1206 catalog_products, 5882 catalog_skus

## Standardized Product Template (Phase 3) — COMPLETE

## Trauma Pilot (Phase 4) — COMPLETE

## Multi-Division Expansion — COMPLETE (2026-03-27)

| Division | Products | Categories | Brands |
|----------|----------|------------|--------|
| Trauma | 16 | 12 | 6 |
| Cardiovascular | 8 | 4 | 4 |
| Diagnostics | 59 | 7 | 4 |
| Joint Replacement | 4 | 5 | 4 |

## P0/P1 Grouping Fix — COMPLETE (2026-03-27)

## P2 SKU Table Polish — COMPLETE (2026-03-27)
- Structured columns, search, pagination, CSV export

## Phase 5A: Semantic Intelligence Layer — COMPLETE (2026-03-27)

### Semantic Backend Collections Seeded
- `brand_system_intelligence`: 13 brand/system lines (ARMAR, AURIC, KET, CLAVO, MBOSS, MIRUS, BioMime, MOZEC, MeriScreen, MeriSera, MeriLisa, AutoQuant, Meril Diagnostics)
- `family_relationships`: 11 relationships (coated_variant_of, belongs_to_system, uses_screw_family, etc.)
- `semantic_rules`: 17 deterministic classification rules
- 297/1206 products enriched with semantic fields

### Clinical Product Reclassification — COMPLETE (2026-03-27)
- **Brand-centric titles removed**: "ARMAR Titanium Plating System" → "Titanium Plating System", "MERISCREEN HIV Rapid Test" → "HIV Rapid Test Kit"
- **Clinical-first naming**: Product titles now follow anatomy + implant type + size (Trauma), device + function (CV), test + analyte (Diagnostics)
- **Brand as secondary subtitle**: "AURIC by Meril • Titanium • TiNbN Coating" shown below title
- **System Intelligence card removed** from frontend (backend data retained for chatbot/comparison)
- **Portfolio nav link added** to main navigation

### Naming Rules by Division
- **Trauma/Ortho**: Anatomy + Implant Type + Size/System (e.g., "2.4mm LPS Distal Radial Volar Buttress Plate")
- **Cardiovascular**: Device Type + Clinical Function + Platform (e.g., "BioMime Aura Sirolimus Eluting Coronary Stent System")
- **Diagnostics**: Test Type + Analyte + Assay (e.g., "HIV 1+2 Whole Blood Rapid Test", "ALBUMIN Reagent")
- **Endo Surgery**: Device Type + Use Case (e.g., "Power Endocutter 60mm Large", "Circular Stapler")
- **Joint Replacement**: Joint + Component Type + System (e.g., "Destiknee Total Knee System")

### New API Endpoints
- `GET /api/catalog/brand-intelligence/{entity_code}` — semantic lookup for brand systems

### Test Results
- iteration_31: Trauma P0/P1 — 100%
- iteration_32: Multi-division — 100% (22/22)
- iteration_34: SKU table polish — 100% (19/19)
- iteration_35: P1 grouping fix — 100% (21/21)
- iteration_37: Phase 5A clinical reclassification — 100% (backend 14/14, frontend 100%)

## Flagged for Future Split (from P0/P1 audit)
- 6 MERISCREEN DOA products sharing 80 SKUs each → need individual test-type split
- 3 AutoQuant reagents (CRP, Lipase, Micro Albumin) sharing 50 SKUs → need individual reagent split
- Freedom Knee 176 SKUs → may need subfamily grouping

## Priority Stack
1. ~~All pipeline/chatbot/catalog phases~~ DONE
2. ~~Multi-Division Expansion~~ DONE
3. ~~P0/P1 Grouping Fix~~ DONE
4. ~~P2 SKU Table Polish~~ DONE
5. ~~Phase 5A: Semantic Intelligence + Clinical Reclassification~~ DONE
6. **Phase 5B: Relationship Graph** (family relationships exposed in API/frontend)
7. **Phase 5C: Split shared-SKU products** (DOA diagnostics, reagents)
8. **Phase 5D: Product Comparison Feature** (using semantic layer)
9. **Phase 5E: Re-audit grouping** (vague/mixed pages using semantic rules)
10. Live DB push (ON HOLD — user wants demo finalized first)
11. WhatsApp bot (ON HOLD — needs Interakt API key)

## Blocked
- File 008 (corrupted DOCX)
- WhatsApp bot (needs Interakt API key)

## Admin Access
- URL: /admin/login
- Password: admin
