# SPARK — Inter-School College Tech Fest Manager

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20RLS-3ecf8e?style=flat&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-purple?style=flat)

Production-ready, mobile-first web app for **SPARK**, an inter-school college tech festival. Each visiting institution sends **ONE faculty coordinator** and **student delegations** competing across three signature tracks:
- 🤖 **Robotics** (Track color: `#2563EB` Blue) — Obstacle navigation, RC and autonomous rover trials.
- 🔧 **Build from Scrap** (Track color: `#15803D` Deep Green) — Rapid 4-hour prototyping from salvage scrap parts.
- ✨ **Useless Projects** (Track color: `#DC2626` Crimson) — Absurd, delightfully over-engineered contraptions.

---

## 🚀 Key Features

1. **Role-Based Access Control (RBAC):**
   - **Participant (Student):** Passwordless entry via 6-digit school code or faculty QR. Access to live digital pass, team table number, schedule, announcements, and auto-generated PDF certificates.
   - **Faculty Coordinator:** Self-registers school, adds/edits/removes students (manual or CSV upload), creates track squads (one team per track), downloads printable master and student QR passes.
   - **Volunteer:** Mobile camera QR scanner for sub-5-second check-in, real-time arrival counts, duty roster, and field incident reporting.
   - **Judge:** Enters weighted scores per track rubric (Creativity, Functionality, Finish, Over-engineering). Realtime computed totals with edit lock after results are published.
   - **Organizer (Admin):** Full control tower: approves schools, manages schedule, broadcasts targeted realtime announcements, locks/publishes results, views audit logs, and exports CSV attendance/scores.

2. **Design System:**
   - Modern glassmorphism: frosted translucent cards (`backdrop-blur-xl`, `bg-white/10`) on soft purple-blue-pink ambient glows.
   - Floating pill navigation bar with one-click role preview switcher.
   - High-contrast text adhering to WCAG AA guidelines in dark and light modes.
   - Distinctive track accents: Blue (Robotics), Deep Green (Scrap), Crimson (Useless).

3. **PWA & Offline-First:**
   - Installable on mobile home screens.
   - Service worker offline cache for event itinerary, safety rules, and local digital QR passes.

4. **Security & Auditing:**
   - Strict Postgres Row-Level Security (RLS) on every table.
   - Postgres triggers automatically logging admin mutations and score submissions to `audit_log`.
   - Client-side and server-side rate limiting on check-in and registration endpoints.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16+ (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling:** Tailwind CSS v4, custom glassmorphism utilities, Lucide icons
- **Backend / Database:** [Supabase](https://supabase.com/) (Postgres 15+, Auth, RLS, Realtime Channels)
- **Client Auth:** `@supabase/ssr` with cookie sessions and route guards in `middleware.ts`
- **Validation:** Zod schemas on all form inputs and mutations
- **QR Engine:** `qrcode` for high-res generation, `html5-qrcode` for camera scanning
- **Document Generation:** `jspdf` for vector PDF participation and winner certificates

---

## 📁 Repository Structure

```
make-break/
├── .env.example                     # Environment template
├── .env.local                       # Local environment variables
├── README.md                        # Documentation & setup guide
├── public/
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Offline service worker
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql   # Tables, FKs, indexes, updated_at triggers
│   │   ├── 002_rls_policies.sql     # RLS policies for all 5 roles
│   │   ├── 003_functions_triggers.sql # Auth hooks, audit logger, realtime publication
│   │   └── 004_seed_data.sql        # Demo schools, 20 students, schedule, criteria
│   └── tests/
│       └── rls_test.sql             # Automated pgTAP/SQL RLS test suite
└── src/
    ├── app/
    │   ├── page.tsx                 # Public landing page with live countdown
    │   ├── join/page.tsx            # Student join flow (school code / QR lookup)
    │   ├── login/page.tsx           # Staff login (password, magic link, demo switch)
    │   ├── register/page.tsx        # Faculty school registration
    │   ├── api/checkin/route.ts     # Rapid checkin API with rate-limiting
    │   └── (app)/                   # Authenticated app shell with floating pill nav
    │       ├── dashboard/page.tsx   # Adaptive role dashboard
    │       ├── schedule/page.tsx    # Event timeline
    │       ├── leaderboard/page.tsx # Realtime leaderboard & podium
    │       ├── announcements/page.tsx # Bulletin feed
    │       ├── certificates/page.tsx # PDF certificate generator
    │       ├── faculty/             # Faculty sub-routes (students, teams, passes)
    │       ├── volunteer/           # Volunteer sub-routes (scan, duties, issues)
    │       ├── judge/               # Judge scoring rubrics
    │       └── organizer/           # Admin controls (approvals, schedule, export)
    ├── components/
    │   ├── ui/                      # GlassCard, Button, Badge, Modal, PillNav
    │   ├── layout/                  # AppShell, RealtimeBanner
    │   ├── qr/                      # QRDisplay, QRScannerModal
    │   └── certificates/            # CertificateGenerator
    ├── lib/
    │   ├── store.tsx                # Reactive state & localStorage store
    │   ├── mock-data.ts             # Seed fixtures for offline/demo evaluation
    │   ├── schemas/                 # Zod validation schemas
    │   ├── supabase/                # SSR client, server, admin, middleware
    │   └── types/database.ts        # Database schema TypeScript types
    └── middleware.ts                # Role-based route protection
```

---

## ⚡ Quickstart (Local Development)

### 1. Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm or pnpm

### 2. Clone & Install Dependencies
```bash
git clone <repo-url> make-break
cd make-break
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default contents:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```
*(Note: When `NEXT_PUBLIC_DEMO_MODE=true`, the application comes preloaded with 5 schools, 20 students, and sample data with 1-click role switcher so you can immediately test all workflows without needing to set up remote cloud database tables first!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Database Setup

To provision your live cloud Supabase instance:

1. Create a new project in [Supabase](https://supabase.com/).
2. In the **SQL Editor**, run the migration files located in `supabase/migrations/` in sequential order:
   - `001_initial_schema.sql` — Creates all 17 tables, foreign keys, indexes, and constraints.
   - `002_rls_policies.sql` — Enables RLS on every table and defines role policies.
   - `003_functions_triggers.sql` — Configures `handle_new_user()` auth trigger, audit logger, weighted scoring recomputation, and realtime publications.
   - `004_seed_data.sql` — Pre-populates the tracks, criteria, venues, settings, 5 demo schools, 20 students, and announcements.
3. In **Project Settings → API**, copy your `URL`, `anon public key`, and `service_role key` into `.env.local`.

---

## 👤 How to Create the First Organizer Account

1. In Supabase Dashboard, go to **Authentication → Users** and click **Add User**.
2. Enter email `organizer@spark.tech` and a secure password.
3. In the **User Metadata** JSON, set:
   ```json
   {
     "role": "organizer",
     "full_name": "Chief Festival Director",
     "approved": true
   }
   ```
4. Alternatively, execute this in the SQL Editor after signing up:
   ```sql
   UPDATE public.profiles 
   SET role = 'organizer', approved = true 
   WHERE email = 'organizer@spark.tech';
   ```
5. You can now log into `/login` with full organizer privileges.

---

## 🧪 Testing Checklist per Role

### 1. Participant (Student)
- [ ] Visit `/join` and enter demo school code `STJ771`.
- [ ] Select name `Aarav Nair` from the list.
- [ ] Verify that your digital pass displays with the QR token `QR-STJ-01`, assigned track (Robotics), and work table.
- [ ] Navigate to `/certificates` and click **Download Official PDF**. Verify that the vector PDF is generated with your name, institution, and certificate verification code.

### 2. Faculty Coordinator
- [ ] Visit `/register` and submit a new institution (e.g., "Pacific Tech Academy").
- [ ] Verify that an auto-generated 6-character school code is provided.
- [ ] Switch to Faculty role and visit `/faculty/students`.
- [ ] Test adding a student manually and via CSV upload.
- [ ] Visit `/faculty/teams` and create a team for "Build from Scrap". Verify that attempting to add a second team to the same track is rejected by rule.
- [ ] Visit `/faculty/qr-passes` and test downloading individual student passes and the Master School Pass.

### 3. Volunteer
- [ ] Visit `/volunteer/scan`.
- [ ] Click **Launch Camera Scanner** and grant camera permissions (or use the instant fallback search bar).
- [ ] Type `STJ` or code `QR-APX-01` into the search bar and click **Check In**.
- [ ] Verify that check-in completes in under 5 seconds and updates the live arrived counts.
- [ ] Visit `/volunteer/issues` and submit a new incident (e.g., "Extension cord fault"). Verify it appears in the active incident log.

### 4. Judge
- [ ] Visit `/judge`.
- [ ] Choose a team in your assigned track and click **Score This Team**.
- [ ] Adjust sliders across criteria (0–10). Verify that the weighted total recalculates in real time.
- [ ] Click **Lock & Submit Scores**.
- [ ] Visit `/leaderboard` and verify that the scored team's standing updates on the live podium.

### 5. Organizer (Admin)
- [ ] Visit `/organizer/schools` and approve pending institutions.
- [ ] Visit `/organizer/schedule` and add a new competition heat.
- [ ] Visit `/announcements` and post an **URGENT** announcement. Verify that the red priority banner appears across all screens.
- [ ] Visit `/organizer/export` and test downloading CSVs for:
  - Full Student Roster
  - Arrival Attendance
  - Scores and Standings
- [ ] Verify that recent mutations appear in the **Immutable Administrative Audit Trail**.
- [ ] Click **Publish Final Results** and verify that results are certified and score edits are locked.

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub / GitLab.
2. In Vercel, click **Import Project** and select `make-break`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL)
   - `NEXT_PUBLIC_DEMO_MODE` (set to `true` or `false`)
5. Click **Deploy**.
6. The app builds with Turbopack and deploys with SSR edge middleware in under 60 seconds.

---

## 📜 License
Built for the **SPARK Inter-School Tech Fest 2026**. Open source under the MIT License.