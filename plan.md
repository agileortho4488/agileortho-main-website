# OrthoConnect (India) — MVP Plan

## Goals (from brief)
- Patient-first orthopaedic education in simple language.
- Home page surgeon discovery with **Search Console** (Location + optional Subspecialty) and **results shown as List + Map**.
- Orthopaedic surgeons can create **FREE** profiles via “Join as Surgeon (Free)” flow.
- Profiles go live only after **Admin approval**.
- **No** paid listings, ranking, ads, appointment booking, prices, reviews.
- Strong disclaimers on every page.

## Key choices confirmed
- **Map:** OpenStreetMap (Leaflet) — free, no API key.
- **Search:** Pincode-based with **simple radius search**.
- **Admin:** Dedicated Admin page to review, categorize, approve, and view uploaded documents.
- **Subspecialty taxonomy:** Shoulder, Elbow, Hand, Hip, Knee, Oncology, Paediatrics (extensible).

---

## Architecture
### Frontend (React + Tailwind + shadcn)
- React Router routes:
  - `/` Home (search + list+map)
  - `/conditions` Conditions hub
  - `/conditions/:slug` Condition page (educational + embedded search console)
  - `/doctor/:slug` Doctor Profile Page (reference-quality)
  - `/join` Surgeon onboarding form (multi-step)
  - `/admin` Admin login
  - `/admin/dashboard` Admin dashboard (pending/approved/rejected)
  - `/about`, `/contact`
- Uses `axios` with `process.env.REACT_APP_BACKEND_URL` only.
- Leaflet map (`react-leaflet`) for search results.

### Backend (FastAPI + Motor + MongoDB)
- REST API under `/api`.
- MongoDB collections:
  - `surgeons`
  - `geo_cache` (Nominatim geocoding cache)
- JWT-based simple admin auth (password-only login for MVP).
- File uploads stored under `backend/uploads/` (MVP). Admin-only download.

---

## Database schema (MVP)
### `surgeons`
```json
{
  "id": "uuid",
  "slug": "dr-amit-sharma-knee-mumbai-7f3a",
  "status": "pending|approved|rejected",
  "created_at": "ISO",
  "updated_at": "ISO",

  "name": "",
  "qualifications": "",
  "registration_number": "MANDATORY",
  "subspecialties": ["Knee", "Sports"],

  "about": "",
  "conditions_treated": [""],
  "procedures_performed": [""],

  "clinic": {
    "address": "",
    "city": "",
    "pincode": "",
    "opd_timings": "",
    "phone": "",
    "geo": {"type": "Point", "coordinates": [72.8777, 19.0760]}
  },

  "profile_photo": {"path": "", "filename": ""},
  "documents": [
    {"id": "uuid", "type": "registration|degree|other", "filename": "", "path": "", "uploaded_at": "ISO"}
  ]
}
```
Indexes:
- `slug` unique
- `clinic.geo` 2dsphere
- `status`, `subspecialties`

### `geo_cache`
```json
{ "query": "400001", "lat": 18.94, "lng": 72.83, "updated_at": "ISO" }
```

---

## API design (MVP)
### Public
- `GET /api/meta/subspecialties`
- `POST /api/surgeons` (creates **pending** profile)
- `GET /api/surgeons/search?location=<pincode|text>&radius_km=10&subspecialty=Knee`
- `GET /api/surgeons/by-slug/{slug}`

### Admin (JWT)
- `POST /api/admin/login` → `{token}`
- `GET /api/admin/surgeons?status=pending`
- `PATCH /api/admin/surgeons/{id}` (approve/reject/update subspecialties)
- `POST /api/admin/surgeons/{id}/documents` (multipart)
- `GET /api/admin/documents/{doc_id}/download`

---

## Frontend flows
### Home search (primary)
1. User enters pincode (or city/area text) + optional subspecialty.
2. Frontend calls `/api/surgeons/search`.
3. Results render as:
   - Left: list cards
   - Right: OSM map with pins
4. Clicking a card (or pin) opens `/doctor/:slug`.
5. Category chips (Knee/Hand/etc.) auto-apply subspecialty filter.

### Join as Surgeon (Free)
- Step-by-step form:
  1) Identity: Name, Qualification, Registration No.
  2) Practice: Subspecialties, About
  3) Clinic: Address, City, Pincode, OPD timings, Clinic phone
  4) Uploads: profile photo (optional), documents (mandatory at least 1)
- Creates pending profile then uploads documents.
- Confirmation screen explains admin review and disclaimers.

### Admin
- Admin login (password) → JWT stored in localStorage.
- Dashboard tabs: Pending / Approved / Rejected.
- Review profile details + download documents.
- Approve / Reject (with reason) + adjust subspecialties.

---

## Testing approach
- Backend: `curl` checks for create/search/profile/admin approval.
- Frontend: Playwright via `testing_agent_v3`:
  - Home loads, search works, map renders, click result opens profile
  - Join flow creates pending profile
  - Admin can login, see pending, approve, and profile appears in public search

---

## Notes / Constraints (MVP)
- Document storage is filesystem-based (MVP). For production, move to S3/GCS.
- Nominatim geocoding is best-effort; cache + rate-limited.
- No doctor ranking: search results are unsorted beyond basic alphabetical or distance (distance only if available).