# Homiq (होमिक्) — India-Focused Rental Accommodation Platform

> **Production-grade rental accommodation platform engineered for Indian tech hubs and metros (Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad).**  
> Empowers renters to find flats, private rooms, PGs, and hostels with **zero hidden costs**, **stamped availability confirmation dates**, **realistic corridor commute estimates**, and **photographic move-in condition records**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **NPM**: v10+

### 2. Setup & Installation
```bash
# Clone and enter workspace
cd "c:\My Web Sites\homiqApp"

# Install dependencies
npm install

# Seed SQLite database with 5 persona roles, listings, rooms, facilities, and records
npm run db:seed
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes unit and integration test suites covering:*
- Authentication & JWT session token validation
- Upfront move-in vs monthly recurring cost calculations
- Multi-parameter search, budget filters, and zero brokerage
- Enquiry creation, viewing booking, and chat messaging

### 4. Build for Production
```bash
npm run build
```

### 5. Launch Local Dev Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 👥 5 User Roles & Separate Workflows

Homiq features role-based access control (RBAC) enforced on the server for all actions. A **1-Click Dev Role Switcher Bar** is pinned to the top of the interface in development mode to effortlessly test and evaluate all 5 personas:

| Role | Demo Email | Password | Persona & Key Workflows |
|---|---|---|---|
| **1. Renter** | `renter@homiq.in` | `Password123!` | **Aarav Sharma**: Search & filter by upfront move-in budget, book in-person or Google Meet video tours, track enquiry threads, review mutual move-in condition records with dated photos, submit reviews. |
| **2. Landlord / Property Owner** | `owner@homiq.in` | `Password123!` | **Rajesh Venkatesh**: List apartments with 0% brokerage, 1-click vacancy reconfirmation button (stamps active date for renters), accept/reschedule viewing visits, log 10-point handover checklists. |
| **3. PG & Co-Living Operator** | `operator@homiq.in` | `Password123!` | **Priya Nambiar**: Manage room & bed-level inventory (single, double, triple sharing), track live occupied vs vacant beds, configure 3-meal weekly food menus, manage resident maintenance tickets. |
| **4. RERA Broker** | `broker@homiq.in` | `Password123!` | **Vikram Kulkarni**: RERA accreditation display (`PRM/KA/RERA/1251`), mandatory representation disclosure (never disguised as owner), pre-disclosed 15-day brokerage fee in upfront cost matrix. |
| **5. Admin / Moderation Staff** | `admin@homiq.in` | `Password123!` | **Neha Iyer**: Triage abuse and misleading price reports, approve landlord property tax & title proofs, audit event log tracking, suspend or reinstate listings. |

---

## 💡 Core Platform Innovations

### 1. Transparent Total Upfront Move-In Cost
Renters in Indian cities are frequently blindsided by surprise security deposit deductions, hidden maintenance, unmentioned brokerages, and onboarding fees. Homiq separates all costs:
- **Upfront Move-In Cost** = `Refundable Security Deposit` + `First Month Rent` + `Brokerage (if broker)` + `One-Time Move-In / Cleaning Charge`
- **Monthly Recurring Cost** = `Base Rent` + `Society Maintenance` + `Estimated Utilities (Power, Water, Gas, Wi-Fi)` + `Food Charges (if meal plan)`

### 2. Stamped Availability Confirmation Date
Ghost listings waste days of searching. Landlords and operators have a **1-Click Reconfirm Vacancy** button that updates a public timestamp badge (e.g. *"Available • Confirmed today"*), giving renters real confidence before booking visits.

### 3. Mutual Move-In Condition Record & Photographic Checklist
Disputes over arbitrary deposit deductions at move-out are a major issue in India. Homiq provides a **10-point mutual inventory checklist** (meter readings, main door keys, wall paint condition, geyser/AC test) with timestamped photos stored securely on both tenant and landlord dashboards.

### 4. Realistic Indian Tech Hub Commute Estimator
Select corporate hubs (Manyata Tech Park, EGL Domlur, RMZ Ecoworld Bellandur, DLF Cyber City Gurgaon, Hiranandani Powai, Hinjewadi Phase 1, Hitec City) and calculate commute times across **Two-Wheeler/Bike**, **Metro + Feeder**, and **Cab/Auto** with peak-traffic corridor factors applied.

### 5. State Tenancy Law Advisory & Model Tenancy Act Notice
Rental regulations across India are governed by individual State legislatures. Homiq clearly educates users that the **Central Model Tenancy Act (MTA)** does not apply uniformly across India, and provides state-specific guidance for Karnataka (Karnataka Rent Control Act), Maharashtra (Maharashtra Rent Control Act Leave & License), and Delhi NCR.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Database**: SQLite via `better-sqlite3` (Embedded, zero external dependencies, WAL mode enabled, foreign keys enforced)
- **Authentication**: Signed HTTP-only session cookies with `jose` (JWT) & `bcryptjs`
- **Styling**: Bespoke Vanilla CSS design system with design tokens, responsive CSS grid, glassmorphism, and micro-animations (No TailwindCSS as requested)
- **Icons**: Lucide React
- **Test Runner**: Node.js 24 Native Test Runner (`node:test`) powered by `tsx`

---

## 📦 Directory Structure

```
c:/My Web Sites/homiqApp/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Landing page with hero search & value pillars
│   │   ├── search/page.tsx              # Multi-filter search, map toggle & compare tray
│   │   ├── listings/[id]/page.tsx       # Detail page, cost breakdown & commute estimator
│   │   ├── listings/new/page.tsx        # Listing creation wizard
│   │   ├── compare/page.tsx             # Side-by-side comparison matrix (up to 4 homes)
│   │   ├── saved/page.tsx               # Saved listings wishlist
│   │   ├── dashboard/
│   │   │   ├── renter/page.tsx          # Renter hub (viewings, chat, condition records)
│   │   │   ├── owner/page.tsx           # Landlord portal (reconfirm availability, visits)
│   │   │   ├── operator/page.tsx        # PG operator console (bed inventory, food plans)
│   │   │   ├── broker/page.tsx          # Broker desk (RERA disclosures, mandates)
│   │   │   └── admin/page.tsx           # Admin compliance (reports queue, audit logs)
│   │   ├── move-in/[id]/page.tsx        # Move-in condition recorder with photo logs
│   │   ├── legal/
│   │   │   ├── tenancy-guide/page.tsx   # State-wise tenancy advisory notice
│   │   │   ├── safety/page.tsx          # Fraud & scam warnings
│   │   │   ├── privacy/page.tsx         # DPDP Act 2023 compliance & address masking
│   │   │   └── terms/page.tsx           # Terms & IT Act 2000 intermediary disclosures
│   │   ├── api/                         # 18 Modular REST API endpoints
│   │   └── globals.css                  # Comprehensive design system stylesheet
│   ├── components/
│   │   ├── Navbar.tsx                   # Role-aware navigation header
│   │   ├── Footer.tsx                   # City hubs, legal disclaimers
│   │   ├── DemoRoleBar.tsx              # 1-Click Persona Evaluator
│   │   ├── ListingCard.tsx              # Card with upfront move-in cost pill
│   │   ├── CostBreakdownCard.tsx        # Itemized cost transparency guarantee
│   │   ├── CommuteEstimator.tsx         # Tech park corridor commute calculator
│   │   └── InteractiveMap.tsx           # Approximate location map
│   └── lib/
│       ├── types.ts                     # Domain TypeScript models & cost formulas
│       ├── api-response.ts              # Response & INR currency formatting helpers
│       ├── auth/                        # Hashing, JWT verification, RBAC guards
│       ├── db/                          # Database connection, schemas, migrations, queries, seed
│       └── *.test.ts                    # Automated test suites
├── data/
│   └── homiq.db                         # SQLite relational database
├── public/uploads/                      # Uploaded media storage
├── .env.example                         # Environment configuration template
└── package.json
```

---

## 🔒 Production Launch Checklist & External Integrations

To deploy Homiq to live production on AWS / Vercel / Railway:
1. **Database**: SQLite is pre-configured and zero-setup for single-instance or VPS deployment. For multi-region serverless clusters, configure PostgreSQL / Supabase connection in `src/lib/db/index.ts`.
2. **Identity Verification**: Integrate DigiLocker / Hyperverge / Karza API credentials for automated Aadhaar and electricity bill OCR verification (`ID_VERIFY_PROVIDER_API_KEY`).
3. **SMS / WhatsApp Gateway**: Add Twilio or MSG91 credentials for transactional visit reminder alerts (`SMS_GATEWAY_API_KEY`).
4. **Cloud Object Storage**: Point `UPLOAD_DIR` in `.env` to AWS S3 or Cloudflare R2 bucket for production media assets.
5. **Session Secrets**: Set `JWT_SECRET` to a cryptographically secure 64-character string in production environment variables.
