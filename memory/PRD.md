# OrthoConnect - Product Requirements Document

## Overview
OrthoConnect is an ethical, patient-first orthopaedic healthcare platform for India — **An initiative of AgileOrtho**.

It provides:
- Research-backed patient education about orthopaedic conditions
- Intelligent surgeon discovery with Hindi/Telugu support
- Free professional profiles for surgeons (max 2 subspecialties)
- Real OTP authentication via 2Factor.in

## Core Principles (Non-Negotiable)
- **No appointment booking** - Only show contact details
- **No paid listings** - All profiles are free
- **No doctor rankings** - Distance/alphabetical sorting only
- **No advertisements** - Clean, ad-free experience
- **No reviews/testimonials** - Can be gamed

## Branding
- **Logo**: "A" in teal gradient + "OrthoConnect" title
- **Tagline**: "An initiative of AgileOrtho"
- **Footer**: "© 2026 OrthoConnect by AgileOrtho"

## Key Features

### 1. Real OTP Authentication ✅ (NEW)
- **Provider**: 2Factor.in
- **API Key**: Configured in backend/.env
- **Flow**: Mobile → SMS OTP → Verify → JWT Token
- **Fallback**: Mocked OTP if SMS fails (development mode)

### 2. Surgeon Registration with Limits ✅ (UPDATED)
- **Max 2 subspecialties** enforced in frontend & backend
- Website field for personal/clinic website
- Structured tags for conditions and procedures
- Multi-location support with geocoding

### 3. Intelligent Search ✅
- Hindi keywords (घुटने का दर्द, कमर दर्द)
- Telugu keywords (మోకాలు, నడుము నొప్పి)
- City aliases (Mumbai/Bombay, Bangalore/Bengaluru)
- Auto-suggest dropdown

### 4. Doctor Profile with Contact ✅
- **WhatsApp Button** - Opens WhatsApp with pre-filled message
- **Call Clinic Button** - Direct tel: link
- **Visit Website Button** - Links to surgeon's website
- Trust badges (Admin Verified, Registration Submitted)

### 5. Patient Education Hub ✅
- 13 conditions with full medical content
- Key takeaways, symptoms, causes, treatments
- References to AAOS, NHS, Mayo Clinic

## Subspecialties
1. Shoulder
2. Elbow
3. Hand
4. Hip
5. Knee
6. Spine
7. Sports Medicine
8. Trauma
9. Oncology
10. Paediatrics

## About Page - Advisory Board
- **B. Nagi Reddy** - Director, Finance & Legal
  - 35+ years in Banking and Legal
  - Qualified CA and LLB

*(Note: Dr. Harsha, Dr. Madhav, Dr. Deepthi removed for conflict of interest)*

## Pages
- `/` - Homepage with smart search
- `/about` - About OrthoConnect & AgileOrtho
- `/contact` - Contact page with form
- `/education` - Education Hub
- `/education/:category` - Category listing
- `/education/:category/:topic` - Topic page
- `/doctor/:slug` - Doctor profile
- `/join` - Surgeon registration
- `/admin` - Admin login
- `/admin/dashboard` - Admin review

## External Links
- Shop: https://www.agileortho.shop (opens in new tab)
- AgileOrtho: https://www.agileortho.in

## Test Credentials
- **Admin**: password `admin`
- **Surgeon OTP**: Real SMS via 2Factor.in

## API Configuration
```
Backend: FastAPI on port 8001
Frontend: React on port 3000
Database: MongoDB
OTP Provider: 2Factor.in
```

## Environment Variables
```
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
TWOFACTOR_API_KEY=a95afc45-e6f0-11f0-a6b2-0200cd936042
ADMIN_PASSWORD=admin
JWT_SECRET=change-me
```

## Completed This Session
- ✅ AgileOrtho branding (logo, tagline, footer)
- ✅ About page updated - only B. Nagi Reddy
- ✅ Max 2 subspecialties limit (frontend + backend)
- ✅ Real OTP via 2Factor.in integration
- ✅ WhatsApp button on doctor profile
- ✅ Website field for surgeons
- ✅ Expanded subspecialties
- ✅ Hindi/Telugu search keywords

## Future/Backlog
- Trust badge system improvements
- Admin "Needs Clarification" status
- SEO city landing pages
- Surgeon profile editing post-approval

---
Last Updated: January 2026
