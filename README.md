# Aláfíà — Health for Every Community

> A two-sided community health platform connecting patients to local clinics — with appointments, medical records, prescriptions, and role-based dashboards.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Design System](#design-system)
- [Roadmap](#roadmap)

---

## Overview

**Aláfíà** (Yoruba for *good health and well-being*) is built for Nigerian communities — especially rural and underserved areas where healthcare access is limited.

| Audience | What they can do |
|---|---|
| **Patients** | Register, sign in, book appointments, view records and prescriptions |
| **Clinics / staff / doctors** | Manage patients, appointments, staff, slots, billing, and medical records |

### Design principles

- **Accessibility first** — low-data friendly, works on basic smartphones
- **Local context** — Nigerian states, Naira, community-relevant health content
- **Simple onboarding** — email + password auth with role selection (patient vs clinic)
- **Separate experiences** — marketing site, auth flows, and role-based dashboards are distinct surfaces

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript** (strict) |
| UI | **React 19**, **Tailwind CSS 3**, **Framer Motion**, **GSAP** |
| Forms | **react-hook-form** + **Zod** |
| Database | **PostgreSQL** + **Prisma 7** |
| Auth | **JWT** (jose) in HTTP-only cookies, edge-verified in `proxy.ts` |
| File uploads | **Cloudinary** (medical attachments) |
| Charts | **Recharts** |

---

## Project Structure

```
alafi/
├── app/
│   ├── (marketing)/          # Public landing, legal, support
│   ├── (auth)/               # Login, register, forgot-password
│   ├── (dashboard)/          # Authenticated dashboards (patient, clinic, doctor)
│   ├── (patient)/            # Legacy patient enrollment + home
│   ├── (clinic)/             # Legacy clinic signup + dashboard
│   └── api/                  # REST API (auth, clinics, patients, dashboard)
├── components/
│   ├── ui/                   # Primitives — Button, Input, Badge, etc.
│   ├── auth/                   # AuthCard, RoleCard, OtpInput
│   ├── marketing/            # Landing page sections
│   ├── dashboard/            # Shared dashboard shell + widgets
│   ├── patient/              # Enrollment flow, patient dashboard
│   └── clinic/               # Clinic signup flow, clinic dashboard
├── hooks/                    # useMultiStep, useDashboard, useGsapReveal, etc.
├── lib/
│   ├── generated/prisma/     # Generated Prisma client
│   ├── prisma.ts             # Prisma singleton
│   ├── validators/           # Zod schemas for auth, medical, slots
│   └── utils.ts              # cn(), formatters, constants
├── prisma/schema.prisma      # Database schema
├── proxy.ts                  # Next.js 16 edge auth proxy (JWT verification)
└── types/                    # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+
- **pnpm** (recommended) or npm
- **PostgreSQL** database

### Installation

```bash
git clone https://github.com/your-org/alafi.git
cd alafi

pnpm install

cp .env.example .env.local
# Edit .env.local — at minimum set DATABASE_URL and JWT_SECRET

pnpm prisma:generate
pnpm prisma:migrate:dev   # first-time database setup

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages & Routes

### Public

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/login` | Sign in (patient or clinic role) |
| `/register` | Create account (patient or clinic admin) |
| `/forgot-password` | Password reset flow (OTP UI — API wiring in progress) |
| `/support`, `/terms`, `/privacy` | Legal and support pages |
| `/unauthorized` | Access denied page |

### Authenticated dashboards

Protected by JWT in `proxy.ts`. Users are redirected based on role after login.

| Route | Role |
|---|---|
| `/patient` | Patient dashboard |
| `/clinic` | Clinic admin / staff dashboard |
| `/doctor` | Doctor dashboard |

### Legacy MVP routes (still public during migration)

| Route | Description |
|---|---|
| `/enroll` | Patient enrollment wizard (mock data) |
| `/home` | Patient home portal (mock) |
| `/signup` | Clinic registration wizard (mock) |
| `/dashboard` | Legacy combined dashboard entry |

---

## API Routes

| Prefix | Purpose |
|---|---|
| `/api/auth/*` | Login, register, logout, session |
| `/api/patients/me/*` | Patient profile, appointments, records, prescriptions |
| `/api/clinics/[clinicId]/*` | Appointments, staff, slots, patients, medical records |
| `/api/dashboard/*` | Aggregated dashboard data by role |
| `/api/admin/cleanup/users` | Admin user cleanup |

---

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing session JWTs |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public app URL (metadata, absolute links) |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name (file uploads) |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest unit tests |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate:dev` | Run migrations (dev) |
| `pnpm prisma:studio` | Open Prisma Studio |

---

## Design System

### Auth layout

Auth pages (`/login`, `/register`, `/forgot-password`) use a single split layout in `app/(auth)/layout.tsx`:

- **Desktop (lg+):** fixed brand panel on the left, centered form card on the right
- **Mobile:** stacked layout with logo header and form card

Form UI primitives live in `components/auth/AuthCard.tsx` (inputs, buttons, step dots, strength bar).

### Fonts

| Role | Font | Tailwind class |
|---|---|---|
| Display | Playfair Display | `font-display` |
| Body | Outfit | `font-body` |

### Colours

Custom tokens in `tailwind.config.ts`: `teal`, `earth`, and `sand` namespaces. Primary brand green: `teal-700` / `#0F6E56`.

### Theme

Dark mode is supported via `ThemeProvider` (class-based `.dark` on `<html>`). Use `ThemeButton` to toggle light / dark / system.

---

## Roadmap

### Done

- [x] Marketing landing page
- [x] Auth UI — login, register, forgot-password
- [x] JWT auth with role-based route protection
- [x] Prisma schema + PostgreSQL integration
- [x] REST API for clinics, patients, appointments, records
- [x] Role-based dashboards (patient, clinic, doctor)
- [x] Legacy enrollment / signup flows (mock data)

### In progress / next

- [ ] Wire forgot-password to real email/OTP API
- [ ] Replace legacy mock dashboards with live API data everywhere
- [ ] Appointment booking with live slot availability
- [ ] SMS reminders (Termii)
- [ ] Billing — Paystack / Flutterwave
- [ ] Clinic verification admin portal
- [ ] Multi-language support (English + Yoruba)

---

## Contributing

1. Create a feature branch from `main`
2. Run `pnpm type-check` and `pnpm lint` before opening a PR
3. Follow existing conventions: PascalCase components, `cn()` for class merging, Zod for validation

---

*Built with care for every community.*

**Aláfíà Health, 2026**
