# Aláfíà — Health for Every Community

> A modern, two-sided community health platform that connects patients in local and rural communities to clinics in a unified system for managing appointments,medical records, and care workflow.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Types](#types)
- [Hooks](#hooks)
- [Utilities & Constants](#utilities--constants)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

**Aláfíà** (from the Yoruba concept of *good health and well-being*) is a two-sided health platform purpose-built for Nigeria's communities — particularly those in rural or underserved areas where access to healthcare is limited.

| Audience | What they can do |
|---|---|
| **Community members / patients** | Enroll, find verified clinics nearby, book appointments, view their own health records and receive health tips |
| **Clinics / healthcare providers** | Manage patients, appointments, billing, medical records, and team members from a single dashboard |

### Key Design Principles

- **Accessibility first** — designed for users with low-data connections and basic smartphones
- **Local context** — Nigerian states, LGAs, Naira currency, local health priorities (malaria, diabetes, antenatal care)
- **Simple onboarding** — phone number as primary identity, email optional
- **Two distinct experiences** — community portal and clinic dashboard are separate surfaces with separate navigation

---

## Project Structure

```
alafi/
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/              # Public landing page — no auth required
│   │   ├── page.tsx              # Landing page
│   │   └── layout.tsx
│   ├── (patient)/                # Patient-facing routes
│   │   ├── enroll/
│   │   │   └── page.tsx          # Patient enrollment wizard
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Patient health portal
│   │   └── layout.tsx
│   ├── (clinic)/                 # Clinic-facing routes
│   │   ├── signup/
│   │   │   └── page.tsx          # Clinic registration wizard
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Clinic management dashboard
│   │   └── layout.tsx
│   ├── globals.css               # Tailwind base + font imports
│   └── layout.tsx                # Root layout with metadata
│
├── components/
│   ├── ui/                       # Primitive atoms — no domain logic
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StepTracker.tsx
│   │   ├── StatCard.tsx
│   │   └── index.ts
│   ├── marketing/                # Landing page section organisms
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustStrip.tsx
│   │   ├── TwoAudiences.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── patient/                  # Patient feature components
│   │   ├── EnrollmentFlow.tsx    # 4-step enrollment wizard
│   │   ├── PatientDashboard.tsx  # Full patient portal
│   │   └── index.ts
│   └── clinic/                   # Clinic feature components
│       ├── ClinicSignupFlow.tsx  # 5-step clinic registration wizard
│       ├── ClinicDashboard.tsx   # Full clinic dashboard
│       └── index.ts
│
├── hooks/
│   ├── useMultiStep.ts           # Multi-step form state manager
│   ├── useClinicDashboard.ts     # Clinic active view state
│   └── usePatientDashboard.ts    # Patient active view state
│
├── types/
│   ├── patient.ts                # Patient, Vitals, MedicalRecord, Enrollment types
│   ├── clinic.ts                 # Clinic, TeamMember, OperatingHours, Signup types
│   ├── appointment.ts            # Appointment, BookingFormData types
│   ├── record.ts                 # MedicalRecord, Attachment types
│   ├── invoice.ts                # Invoice, InvoiceItem types
│   └── index.ts                  # Barrel export
│
├── lib/
│   └── utils.ts                  # cn(), formatters, ID generators, constants
│
├── tailwind.config.ts            # Aláfíà design tokens
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
└── .env.example                  # Environment variable template
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/alafi.git
cd alafi

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |
| `npm run type-check` | Run TypeScript compiler without emitting files |

---

## Architecture

### Framework

Built on **Next.js 14** using the **App Router**. Server components are used for static/SEO-critical content; client components (`'use client'`) are used for interactive forms and dashboards.

### Route Groups

Route groups (folders in parentheses) separate concerns without affecting URLs:

| Group | URL prefix | Purpose |
|---|---|---|
| `(marketing)` | `/` | Public landing page, no authentication |
| `(patient)` | `/enroll`, `/dashboard` | Patient portal, requires patient session |
| `(clinic)` | `/clinic/signup`, `/clinic/dashboard` | Clinic management, requires clinic admin session |

### State Management

The MVP uses **local React state** via `useState` and custom hooks. For production scaling:

- **Server/remote state**: React Query or SWR for data fetching and caching
- **Global UI state**: Zustand or Jotai
- **Authentication**: NJwt based authentication, separate strategies for patients vs clinic admins
- **Database**: PostgreSQL with Prisma ORM (schema to be added)

### Component Architecture

Components follow an **atomic design** hierarchy:

```
ui/          → Atoms   — Button, Badge, Input, Select, StatCard (zero domain logic)
marketing/   → Sections — full landing page blocks, assembled from atoms
patient/     → Features — EnrollmentFlow, PatientDashboard (domain logic, hooks)
clinic/      → Features — ClinicSignupFlow, ClinicDashboard (domain logic, hooks)
```

---

## Pages & Routes

| Route | File | Description | Auth |
|---|---|---|---|
| `/` | `(marketing)/page.tsx` | Public landing page | None |
| `/enroll` | `(patient)/enroll/page.tsx` | Patient enrollment wizard | None |
| `/dashboard` | `(patient)/dashboard/page.tsx` | Patient health portal | Patient session |
| `/clinic/signup` | `(clinic)/signup/page.tsx` | Clinic registration wizard | None |
| `/clinic/dashboard` | `(clinic)/dashboard/page.tsx` | Clinic management dashboard | Clinic admin session |

---

## Components

### UI Primitives (`components/ui/`)

All primitives accept a `className` prop for overrides. They use `cn()` to merge Tailwind classes safely.

---

#### `Button`

Primary interactive element used throughout Aláfíà.

```tsx
import { Button } from '@/components/ui'

// Variants: primary | outline | ghost | white | danger
// Sizes:    sm | md | lg

<Button variant="primary" size="md">
  Sign up free
</Button>

<Button variant="outline" size="sm" loading={isLoading}>
  Continue
</Button>

<Button variant="primary" size="lg" fullWidth>
  Complete enrollment
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `ButtonVariant` | `'primary'` | Visual style |
| `size` | `ButtonSize` | `'md'` | Padding and font size |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `fullWidth` | `boolean` | `false` | `w-full` |
| `...rest` | `ButtonHTMLAttributes` | — | All native button props |

---

#### `Badge`

Status indicator pill used in tables and appointment lists.

```tsx
import { Badge } from '@/components/ui'

// Variants: confirmed | pending | cancelled | completed | active | info

<Badge variant="confirmed">Confirmed</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="cancelled">Cancelled</Badge>
<Badge variant="completed">Completed</Badge>
```

---

#### `Input`

Styled text input with optional label, hint text, and inline error state.

```tsx
import { Input } from '@/components/ui'

<Input
  label="First name"
  placeholder="Amaka"
  value={form.firstName}
  error={errors.firstName}
  onChange={(e) => set('firstName', e.target.value)}
/>

// Optional field
<Input
  label="Email address"
  optional
  type="email"
  hint="For appointment confirmations"
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Renders a `<label>` above the input |
| `hint` | `string` | Helper text below (hidden when `error` is set) |
| `error` | `string` | Red error text; also sets error border |
| `optional` | `boolean` | Appends "(optional)" to the label |

---

#### `Select`

Styled `<select>` dropdown with the same label/hint/error API as `Input`.

```tsx
import { Select } from '@/components/ui'
import { NIGERIAN_STATES } from '@/lib/utils'

<Select
  label="State of residence"
  placeholder="Select your state"
  options={NIGERIAN_STATES.map(s => ({ value: s, label: s }))}
  value={form.state}
  error={errors.state}
  onChange={(e) => set('state', e.target.value)}
/>
```

---

#### `ProgressBar`

Multi-step form progress indicator with labelled steps and an animated fill bar.

```tsx
import { ProgressBar } from '@/components/ui'

<ProgressBar
  labels={['Personal', 'Contact', 'Clinic', 'Confirm']}
  currentStep={2}
/>
```

---

#### `StepTracker`

Vertical left-panel tracker for multi-step flows. Supports dark (for dark sidebar) and light themes. Shows checkmarks for completed steps.

```tsx
import { StepTracker } from '@/components/ui'

const STEPS = [
  { title: 'Personal details',   subtitle: 'Name, date of birth, gender' },
  { title: 'Contact & location', subtitle: 'Phone, state, address' },
  { title: 'Choose a clinic',    subtitle: 'Find a clinic near you' },
  { title: 'Review & confirm',   subtitle: 'Check your details' },
]

<StepTracker
  steps={STEPS}
  currentStep={currentStep}
  theme="dark"
/>
```

---

#### `StatCard`

Dashboard metric tile with icon, formatted value, label, and optional delta badge.

```tsx
import { StatCard } from '@/components/ui'
import { Users } from 'lucide-react'

<StatCard
  label="Total patients"
  value="1,284"
  delta="↑ 12"
  deltaType="up"
  icon={<Users size={16} />}
  iconColor="teal"
/>
```

**`iconColor` options:** `teal` | `amber` | `blue` | `earth` | `red`
**`deltaType` options:** `up` | `neutral` | `down`

---

### Marketing Components (`components/marketing/`)

All marketing components are **server components** — no `'use client'` unless interactivity is needed.

| Component | Description |
|---|---|
| `Navbar` | Sticky navigation bar with logo, links, "Sign in" and "Get started" CTAs |
| `Hero` | Full-screen hero section with dual audience CTA cards (patient + clinic) and a live UI preview stack on the right |
| `TrustStrip` | Horizontal band of 5 trust signals: security, setup time, clinic count, low-data friendly, any device |
| `TwoAudiences` | Two large cards side-by-side: community members (dark teal) and clinics (earthy light), each with their own feature list and CTA |
| `HowItWorks` | Tab-switched 3-step flows for patients and clinics, set on a dark teal background |
| `Features` | 3-column grid of 6 feature cards with top-border hover animation |
| `FinalCTA` | Full-width dark teal banner with "Enroll as a patient" and "Set up a clinic" CTAs |
| `Footer` | Minimal footer with logo, nav links, and copyright |

---

### Patient Components (`components/patient/`)

#### `EnrollmentFlow`

4-step patient registration wizard. Self-contained with internal state — no props required.

**Steps:**

| Step | Fields |
|---|---|
| 1 — Personal details | First name, last name, date of birth, gender (pill select), blood group (optional) |
| 2 — Contact & location | Phone (with +234 prefix), email (optional), state (all 37), LGA (optional), address (optional) |
| 3 — Choose a clinic | Searchable clinic cards with radio selection |
| 4 — Review & confirm | Full summary of all entered data + consent checkbox |

On submission, generates an `ALF-XXXXXX` patient ID and renders a **success screen** with the ID and two next-step CTAs.

**Validation:** Each step validates required fields before advancing. Errors render inline beneath the relevant input.

```tsx
import { EnrollmentFlow } from '@/components/patient'

export default function EnrollPage() {
  return <EnrollmentFlow />
}
```

---

#### `PatientDashboard`

Full patient portal shell with teal sidebar and 6 switchable views.

| View | Content |
|---|---|
| `home` | Personalised welcome banner with patient ID, next appointment card with reschedule + directions actions, 3 stat cards (visits, records, clinics), health tips preview |
| `appointments` | Upcoming appointments (date block, title, doctor, status badge) + past appointments history |
| `records` | Medical records list with record type, doctor, clinic, and date |
| `clinics` | Searchable + filterable clinic discovery with distance, hours, service tags, and booking CTA |
| `tips` | 6 community-relevant health tip cards (malaria, hydration, BP, immunisation, exercise, handwashing) |
| `profile` | Full personal and contact information with edit action |

```tsx
import { PatientDashboard } from '@/components/patient'

export default function PatientDashboardPage() {
  return <PatientDashboard />
}
```

---

### Clinic Components (`components/clinic/`)

#### `ClinicSignupFlow`

5-step clinic registration wizard. Self-contained with internal state.

**Steps:**

| Step | Fields |
|---|---|
| 1 — Clinic details | Name, type (12 options), description, year established, bed count |
| 2 — Location & contact | State, LGA, city, street address, phone (+234), email, website, interactive operating hours grid (7 days, toggle closed) |
| 3 — Services offered | 16 service checkboxes, insurance providers, languages spoken |
| 4 — Admin account | First/last name, work email, password + confirm, role (radio), dynamic team member invite cards |
| 5 — Review & launch | Full summary + consent checkbox |

On submission, generates a `CLN-XXXXXX` clinic ID and renders a **success screen** with the ID, "what happens next" verification guidance, and two CTAs.

```tsx
import { ClinicSignupFlow } from '@/components/clinic'

export default function ClinicSignupPage() {
  return <ClinicSignupFlow />
}
```

---

#### `ClinicDashboard`

Full clinic management shell with teal-900 sidebar and 6 switchable views.

| View | Content |
|---|---|
| `overview` | 4 stat cards (patients, today's appointments, revenue, records), today's appointment table with clickable rows, live activity feed |
| `patients` | Searchable patient table with filter tabs; clicking any row opens a **slide-over drawer** with patient vitals, doctor notes, and upcoming appointments |
| `appointments` | Interactive **weekly calendar view** with colour-coded event blocks (teal = general, amber = follow-up, blue = other); day navigation and view mode toggle |
| `billing` | 3 revenue summary cards, full invoice table with paid/unpaid status |
| `records` | Medical records table with doctor notes preview |
| `settings` | Clinic profile editor — name, type, description, contact details with save action |

**Patient Drawer:** slides in from the right on patient row click. Displays personal info grid, latest vitals (BP, temperature, pulse), clinical notes, upcoming appointments, and action buttons (view full record, book appointment).

```tsx
import { ClinicDashboard } from '@/components/clinic'

export default function ClinicDashboardPage() {
  return <ClinicDashboard />
}
```

---

## Types

All TypeScript types live in `types/`. Import from the barrel export:

```ts
import type {
  Patient,
  MedicalRecord,
  Vitals,
  EnrollmentFormData,
  Clinic,
  ClinicType,
  TeamMember,
  OperatingHours,
  Appointment,
  AppointmentStatus,
  BookingFormData,
  Invoice,
  InvoiceStatus,
} from '@/types'
```

### `Patient`

```ts
interface Patient {
  id: string                              // "ALF-002849"
  firstName: string
  lastName: string
  dateOfBirth: string                     // ISO 8601: "1993-03-14"
  gender: 'Male' | 'Female' | 'Prefer not to say'
  bloodGroup?: 'A+' | 'A−' | 'B+' | 'B−' | 'AB+' | 'AB−' | 'O+' | 'O−' | 'Unknown'
  phone: string
  email?: string
  state: string
  lga?: string
  address?: string
  primaryClinicId: string
  enrolledAt: string                      // ISO 8601
  totalVisits: number
  status: 'active' | 'pending' | 'inactive'
}
```

### `Clinic`

```ts
interface Clinic {
  id: string                              // "CLN-482910"
  name: string
  type: ClinicType
  description?: string
  state: string
  address: string
  phone: string
  services: string[]
  insurance: string[]
  languages: string[]
  hours: OperatingHours[]
  verified: boolean
  registeredAt: string
  distanceKm?: number                     // populated from geolocation
}
```

### `Appointment`

```ts
interface Appointment {
  id: string
  patientId: string
  patientName: string
  clinicId: string
  clinicName: string
  doctorName: string
  type: AppointmentType | string
  date: string                            // "2025-04-02"
  time: string                            // "09:00"
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show'
  notes?: string
  createdAt: string
}
```

### `Invoice`

```ts
interface Invoice {
  id: string                              // "INV-0048"
  patientId: string
  patientName: string
  clinicId: string
  items: InvoiceItem[]
  totalKobo: number                       // amount in kobo (₦1 = 100 kobo)
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled'
  issuedAt: string
  paidAt?: string
  dueAt: string
}
```

---

## Hooks

### `useMultiStep(totalSteps: number)`

Manages step state for multi-step forms. Steps are **1-indexed**.

```ts
const {
  currentStep,       // number  — current active step (starts at 1)
  totalSteps,        // number  — total number of steps
  isFirst,           // boolean — true when on step 1
  isLast,            // boolean — true when on the final step
  goNext,            // () => void — advance one step
  goBack,            // () => void — go back one step
  goToStep,          // (step: number) => void — jump to specific step
  progressPercent,   // number  — 0–100, suitable for progress bar width
} = useMultiStep(4)
```

**Usage:**

```tsx
function MyForm() {
  const { currentStep, goNext, goBack, isLast, progressPercent } = useMultiStep(4)

  return (
    <>
      <div style={{ width: `${progressPercent}%` }} />
      {currentStep === 1 && <Step1 onNext={goNext} />}
      {currentStep === 2 && <Step2 onNext={goNext} onBack={goBack} />}
    </>
  )
}
```

---

### `useClinicDashboard(initial?: DashboardView)`

Manages active view state for the clinic dashboard.

```ts
type DashboardView =
  | 'overview' | 'patients' | 'appointments'
  | 'billing'  | 'records'  | 'settings'

const { activeView, setView } = useClinicDashboard('overview')
```

---

### `usePatientDashboard(initial?: PatientView)`

Manages active view state for the patient portal.

```ts
type PatientView =
  | 'home' | 'appointments' | 'records'
  | 'clinics' | 'tips' | 'profile'

const { activeView, setView } = usePatientDashboard('home')
```

---

## Utilities & Constants

All utilities and constants live in `lib/utils.ts`.

```ts
import {
  cn,
  generatePatientId,
  generateClinicId,
  formatDate,
  formatTime,
  getInitials,
  NIGERIAN_STATES,
  CLINIC_SERVICES,
  INSURANCE_OPTIONS,
  DAYS_OF_WEEK,
  getDefaultHours,
} from '@/lib/utils'
```

| Export | Type | Description |
|---|---|---|
| `cn(...classes)` | `function` | Merge Tailwind classes safely via clsx + tailwind-merge |
| `generatePatientId()` | `function` | Returns a random `ALF-XXXXXX` string |
| `generateClinicId()` | `function` | Returns a random `CLN-XXXXXX` string |
| `formatDate(iso, options?)` | `function` | Locale-aware date: `"14 March 1993"` |
| `formatTime(time)` | `function` | `"09:00"` → `"9:00 AM"` |
| `getInitials(name)` | `function` | `"Amaka Obi"` → `"AO"` |
| `NIGERIAN_STATES` | `string[]` | All 36 states + FCT Abuja |
| `CLINIC_SERVICES` | `string[]` | 16 available clinic service types |
| `INSURANCE_OPTIONS` | `string[]` | NHIS, HMO, PHIS, Hygeia, Reliance HMO, Out-of-pocket |
| `DAYS_OF_WEEK` | `string[]` | Monday through Sunday |
| `getDefaultHours()` | `function` | Default operating hours for all 7 days |

---

## Design System

### Fonts

Loaded via Google Fonts in `app/globals.css`. Applied as Tailwind custom font families.

| Role | Font | Tailwind class | Usage |
|---|---|---|---|
| Display | Playfair Display | `font-display` | Headings, stat values, patient/clinic names |
| Body | Outfit | `font-body` | All other text — labels, descriptions, buttons |

### Colour Palette

Extended in `tailwind.config.ts`. All custom colours use the `teal`, `earth`, and `sand` namespaces.

| Token | Hex | Usage |
|---|---|---|
| `teal-700` | `#165e4a` | Primary CTAs, active nav states, button background |
| `teal-800` | `#0e4e3e` | Patient sidebar background, dark banners |
| `teal-900` | `#072e24` | Clinic sidebar background, deepest headings |
| `teal-50` | `#edf7f3` | Light hover fills, tag backgrounds |
| `teal-100` | `#c8eade` | Borders on teal-tinted cards |
| `earth-50` | `#faf6f0` | Clinic signup left panel |
| `earth-100/200` | warm beige | Secondary accents, earth-toned borders |
| `sand-50` | `#faf9f6` | Page background, input background |
| `sand-100` | `#f3f0ea` | Subtle dividers, secondary backgrounds |
| `sand-200` | `#e8e2d8` | Default border colour |

### Border Radius

| Tailwind class | Value | Usage |
|---|---|---|
| `rounded-lg` (default) | `8px` | Inputs, small cards |
| `rounded-xl` | `12px` | Form fields, table cells |
| `rounded-2xl` | `24px` | Large cards, modals, drawer |
| `rounded-full` | `9999px` | Buttons, badges, pills |

### Shadows

| Token | Usage |
|---|---|
| `shadow-card` | Default card hover |
| `shadow-cta` | Primary teal button |
| `shadow-cta-hover` | Primary button on hover |

### Animations

| Name | Description |
|---|---|
| `animate-fade-up` | Entry animation — fade in from below (landing page) |
| `animate-step-in` | Slide in from right (form step transitions) |
| `animate-pop-in` | Scale in from 0.5 (success icon) |

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Full URL of the app (e.g. `https://alafi.health`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Must match `APP_URL` |
| `NEXTAUTH_SECRET` | Yes | Random secret string for JWT signing |
| `EMAIL_FROM` | Yes | Sender address for transactional emails |
| `RESEND_API_KEY` | Yes | API key for email delivery (Resend recommended) |
| `SMS_PROVIDER_API_KEY` | Yes | API key for SMS (Termii recommended for Nigeria) |
| `NEXT_PUBLIC_MAPS_API_KEY` | Optional | Google Maps / Mapbox key for clinic location |

---

## Roadmap

### MVP (current)
- [x] Landing page with dual audience entry points
- [x] Patient enrollment flow (4 steps)
- [x] Clinic signup flow (5 steps)
- [x] Clinic dashboard (overview, patients, appointments, billing, records, settings)
- [x] Patient portal (home, appointments, records, clinic discovery, health tips, profile)

### Next priorities
- [ ] Authentication — NextAuth.js with separate patient and clinic admin roles
- [ ] Database integration — Prisma + PostgreSQL schema
- [ ] Real clinic discovery — search with geolocation using browser GPS or state/LGA lookup
- [ ] Appointment booking — live availability, booking confirmation, SMS reminders via Termii
- [ ] Medical records upload — file attachments, PDF generation
- [ ] Billing — invoice creation, payment tracking, integration with Paystack / Flutterwave
- [ ] Admin verification portal — internal tool to verify newly registered clinics
- [ ] Notification system — in-app, email, and SMS notifications
- [ ] Multi-language support — English + Yoruba as first expansion

### Future
- [ ] Progressive Web App (PWA) for offline support and home screen install
- [ ] Mobile-native wrapper (Expo / React Native)
- [ ] Analytics dashboard for clinic owners
- [ ] Health records portability — patient-initiated record sharing between clinics
- [ ] Telemedicine video calls (WebRTC)

---

## Contributing

### Workflow

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, following the conventions below.

3. Run checks before committing:
   ```bash
   npm run type-check
   npm run lint
   ```

4. Open a pull request against `main` with a clear description of what was changed and why.

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `PatientDashboard.tsx` |
| Hooks | camelCase with `use` prefix | `useMultiStep.ts` |
| Types / Interfaces | PascalCase | `interface Patient {}` |
| Utility functions | camelCase | `formatDate()` |
| Constants | SCREAMING_SNAKE_CASE | `NIGERIAN_STATES` |
| CSS classes | Tailwind utilities only — no custom CSS except `globals.css` | |
| Component props interfaces | `ComponentNameProps` | `interface ButtonProps {}` |

### Code Style

- **TypeScript strict mode** is enabled — no `any`, no `@ts-ignore` without explanation
- All exported components must have a **JSDoc comment** describing their purpose
- Props interfaces must be declared above the component function
- Use `cn()` from `@/lib/utils` for all conditional class merging — never string concatenation
- Use `lucide-react` for all icons — no inline SVGs in TSX except for the Aláfíà logomark

---

*Built with care for every community.*

**Aláfíà Health, 2025**
