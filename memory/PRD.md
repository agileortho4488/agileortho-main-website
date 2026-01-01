# OrthoConnect - Product Requirements Document

## Overview
OrthoConnect is an ethical, patient-first orthopaedic healthcare platform for India. The platform provides:
- Patient education about orthopaedic conditions in simple language
- Surgeon discovery (search by location/specialty)
- Free professional profiles for surgeons

## Core Principles (Non-Negotiable)
- **No appointment booking** - Only show contact details
- **No paid listings** - All profiles are free
- **No doctor rankings** - Distance/alphabetical sorting only
- **No advertisements** - Clean, ad-free experience
- **No reviews/testimonials** - Can be gamed

## Design System (Implemented - Premium Health-Tech)
- **Style**: Modern health-tech with animations and glow effects
- **Color Palette**: Monochrome + Teal Accent (Option A)
  - Background: Pure white (#FFFFFF)
  - Primary Text: Rich black (#0A0A0A)
  - Secondary Text: Slate grey (#64748B)
  - Accent: Medical teal (#0D9488)
  - Category Gradients: Red, Blue, Violet, Emerald, Amber, Pink, etc.
- **Typography**: Inter font family
- **Components**: Shadcn/UI + Framer Motion animations
- **Effects**: 
  - Floating background orbs with blur
  - Glow effects on hover (cards, buttons)
  - Scroll-triggered animations (fade-in, scale, stagger)
  - Gradient text and underlines
  - Glassmorphism elements

## Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT + Mocked OTP (for MVP)

## Key Features

### 1. Patient Education Hub (REDESIGNED)
- Dark gradient hero with animated orbs
- Category cards with unique color gradients and glow effects
- Topic pages with animated accordions
- Key Takeaways card with gradient styling
- Urgent Care sidebar with red glow
- Scroll-triggered entrance animations

### 2. Surgeon Discovery
- Premium search bar with glow effect
- "Near me" button with teal accent
- Popular searches with emoji icons
- Animated radius controls
- Stats section with hover effects

### 3. Homepage (REDESIGNED)
- Full-height hero with gradient text
- "India's Ethical Platform" badge
- Trust bar with colored icons
- Know Your Condition section (dark theme, glowing cards)
- Red Flags section with animated cards
- Non-Surgical Care section
- Surgeon CTA with gradient button

### 4. Doctor Profiles
- Premium header with photo
- Subspecialty badges
- Locations accordion
- Contact card with CTAs

### 5. Admin Dashboard
- Review pending profiles
- Approve/Reject with notes
- Photo visibility control

## Pages Implemented
- `/` - Homepage (animated, premium design)
- `/education` - Education Hub (dark hero, glowing cards)
- `/education/:category` - Category (dark header, topic grid)
- `/education/:category/:topic` - Topic (gradient Key Takeaways)
- `/doctor/:slug` - Doctor profile
- `/join` - Surgeon registration
- `/admin` - Admin dashboard
- `/about`, `/contact` - Info pages

## What's Implemented ✅
- [x] Complete UI overhaul with Framer Motion animations
- [x] Floating animated background orbs
- [x] Glow effects on card hover
- [x] Gradient text and underlines
- [x] Scroll-triggered animations
- [x] Category-specific color gradients
- [x] Dark/gradient headers
- [x] Stats section with counters
- [x] Popular searches with emojis
- [x] Premium search bar design
- [x] Mobile responsive design

## Upcoming Tasks (P1)
- [ ] Search Intelligence (synonyms, Hindi/Telugu keywords)
- [ ] Auto-suggest while typing
- [ ] Surgeon dashboard improvements

## Future Tasks (P2)
- [ ] Trust signals (verification badges)
- [ ] City landing pages
- [ ] Multi-language support

## Test Credentials
- Admin password: `admin`
- Test mobile: Any 10-digit number (OTP is mocked)

---
Last Updated: January 2026
