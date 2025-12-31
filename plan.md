# OrthoConnect — Iteration 2 Plan (Dynamic Search + Surgeon Login + Multi-Clinic + Image Segments)

## New requirements (confirmed)
- Home page: **single, Google-like search bar** (e.g., “shoulder specialist near Hyderabad”).
- Smart parsing with synonym mapping (e.g., “kids ortho” → Paediatrics; “hand & wrist” → Hand).
- Home page segmented sections with **free stock images**.
- Conditions UX: category grid with images → inside list of conditions as image boxes.
- Surgeons: **email + password login** (Google/Facebook/LinkedIn later).
- Surgeons can have **multiple clinic/hospital locations**; search matches any location.

---

## Architecture updates
### Backend
- Collections:
  - `users` (role: surgeon/admin)
  - `profiles` (surgeon professional profiles, status pending/approved/rejected)
  - `geo_cache` (Nominatim cache)
- JWT auth for surgeons.
- Admin auth stays as password login (JWT) for MVP.

### Frontend
- Home: SmartSearchBar → calls `/api/profiles/smart-search`.
- Join: first creates surgeon account (name/email/mobile/password) then profile setup (multi-step).
- Profile page shows **multiple locations**.
- Conditions: `/conditions` → categories; `/conditions/:category` → conditions list; `/conditions/:category/:slug` → detail.

---

## API (Iteration 2)
### Public
- `GET /api/meta/subspecialties`
- `GET /api/profiles/smart-search?q=&radius_km=`
- `GET /api/profiles/search?location=&radius_km=&subspecialty=`
- `GET /api/profiles/by-slug/{slug}`

### Surgeon auth
- `POST /api/auth/surgeon/signup`
- `POST /api/auth/surgeon/login`
- `GET /api/surgeon/me`

### Surgeon profile (requires surgeon JWT)
- `PUT /api/surgeon/me/profile` (creates/updates; sets pending)
- `POST /api/surgeon/me/profile/documents` (multipart)

### Admin
- `POST /api/admin/login`
- `GET /api/admin/profiles?status=pending`
- `PATCH /api/admin/profiles/{profile_id}` approve/reject/edit
- `GET /api/admin/documents/{doc_id}/download?token=...`

---

## DB schema (high-level)
### users
- id, role, name, email(unique), mobile, password_hash, created_at

### profiles
- id, user_id, slug(unique), status, name, qualifications, registration_number
- subspecialties[], about, conditions_treated[], procedures_performed[]
- locations[]: {id, facility_name, address, city, pincode, opd_timings, phone, geo(Point)}
- documents[]: {id,type,filename,path,uploaded_at}

Indexes:
- users.email unique
- profiles.slug unique
- profiles.status
- profiles.subspecialties
- profiles.locations.geo (2dsphere)

---

## Testing
- E2E: Smart search bar parsing, list+map results.
- Surgeon signup/login, create profile with 2 locations.
- Admin approves profile.
- Public search returns approved profile.
- Conditions category → conditions list → condition detail.
