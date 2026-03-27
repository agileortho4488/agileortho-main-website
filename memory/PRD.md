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

### Final Metrics
| Metric | Count |
|--------|-------|
| Raw extracted products | 523 |
| Normalized products | 481 |
| Unique SKU codes | 5,107 |
| SKU occurrences | 6,065 |
| Brands | 97 |
| Divisions | 13 |
| Training chunks | 654 |

## Website Chatbot UI — COMPLETE
- Confidence-aware chat bubbles, WhatsApp handoff, session tracking, telemetry

## Catalog Taxonomy & Merge (Phase 1 & 2) — COMPLETE
- 6 taxonomy collections, 1206 catalog_products, 5882 catalog_skus

## Standardized Product Template (Phase 3) — COMPLETE

## Trauma Pilot (Phase 4) — COMPLETE
- P0/P1 polish: Category placeholders, Family Code, title-cased specs, unified coating, brand hierarchy

## Multi-Division Expansion — COMPLETE (2026-03-27)

| Division | Products | Categories | Brands | Icon | Color |
|----------|----------|------------|--------|------|-------|
| Trauma | 43 | 12 | 6 | Bone | Amber |
| Cardiovascular | 8 | 4 | 4 | HeartPulse | Rose |
| Diagnostics | 63 | 7 | 4 | Microscope | Violet |
| Joint Replacement | 7 | 5 | 4 | Activity | Teal |

### New Pages
- `/catalog` — Portfolio index showing all 4 division cards
- `/catalog/:divisionSlug` — Generic division listing (CatalogDivision.jsx)
- Updated product detail breadcrumbs to dynamic division routing

## P0 Grouping Fix & P2 SKU Table Polish — COMPLETE (2026-03-27)

### P0: Humerus Page Rename & Grouping Audit
- Renamed "2.7mm-3.5mm LPS Medial Distal Humerus Plates" to "2.7mm-3.5mm LPS Humerus Bone Plates (Titanium)" — heading was too narrow for 83 SKUs spanning 9 plate subfamilies
- Hidden duplicate humerus page (shared identical 83 SKU set)
- Mapped SKU prefix codes to actual plate subtype names from brochure data:
  - MT-PT01 → Posterolateral Distal (10 SKUs)
  - MT-PT02/03 → Posterolateral Distal w/ Lat Support (20 SKUs)
  - MT-PT09 → Medial Distal (12 SKUs)
  - MT-PT15 → Medial Distal Metaphyseal (10 SKUs)
  - MT-PT41 → Extra-articular Distal (12 SKUs)
  - MT-PT49 → Extra-articular Distal (Short) (2 SKUs)
  - MT-PT51 → Proximal (2 SKUs)
  - MT-PT52 → Proximal (Long) (5 SKUs)
  - MT-PT74 → Periarticular Proximal Lateral (10 SKUs)
- Flagged 7 DOA products + 3 reagent products sharing SKU pools for future split
- Systematic audit of all 39 large-variant products completed

### P2: SKU Table Polish
- **Structured columns**: SKU Code, Holes, Length (mm), Plate Subtype, Side, Brand, Source
- **Sticky header**: Table header stays visible on scroll
- **Search/filter**: Case-insensitive search across all fields
- **Pagination**: 30 SKUs per page with prev/next controls
- **CSV export**: Download all variants as CSV
- **Color-coded side badges**: Blue = Left, Orange = Right
- **Clean source links**: "View Brochure" clickable badges replacing truncated filenames
- **Adaptive columns**: Products without parsed data show Product Name column instead

### Test Results
- iteration_31.json: P0/P1 Trauma template — 100% pass
- iteration_32.json: Multi-division expansion — 100% pass (22/22)
- iteration_34.json: P0 grouping fix + P2 SKU table polish — 100% pass (19/19)

## Priority Stack
1. ~~SKU Intelligence Pipeline~~ DONE
2. ~~Website Chatbot UI~~ DONE
3. ~~Catalog Taxonomy (Phase 1)~~ DONE
4. ~~Catalog Merge (Phase 2)~~ DONE
5. ~~Standardized Template (Phase 3)~~ DONE
6. ~~Trauma Pilot (Phase 4)~~ DONE
7. ~~Multi-Division Expansion~~ DONE
8. ~~P0 Grouping Fix + P2 SKU Table Polish~~ DONE
9. **P1: Split mis-grouped pages into proper product-family pages** (humerus subfamilies, DOA tests, reagents)
10. **P3: Add Portfolio to main navigation**
11. Product Comparison Feature
12. Live DB push (ON HOLD)
13. WhatsApp bot (ON HOLD — needs Interakt API key)

## Blocked
- File 008 (corrupted DOCX)
- WhatsApp bot (needs Interakt API key)

## Admin Access
- URL: /admin/login
- Password: admin
