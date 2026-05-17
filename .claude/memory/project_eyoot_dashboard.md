---
name: lvn Dashboard Project Context
description: Full context for the lvn admin dashboard project — architecture, sections built, patterns used
type: project
---

This is a Next.js 16 + TypeScript + Tailwind v4 + TanStack React Query v5 admin dashboard for the lvn student internship platform.

**Core architecture:**
- API layer: `lib/api-client.ts` (Axios with JWT interceptor, `api-key` header)
- CRUD abstraction: `lib/core/crud-provider.ts` + `lib/hooks/useResource.ts`
- Per-domain hooks follow `lib/users.ts` pattern: named API object + individual `useQuery`/`useMutation` exports
- Nav config: `lib/config/dashboard-config.ts` — defines all 15 sidebar items, icons, roles

**All pages built (app/dashboard/):**
- `page.tsx` — stats grid (16 cards), alerts, quick-nav links
- `students/page.tsx` — table with type/IBM/app count, filterable
- `students/[id]/page.tsx` — Basic Info / Student Form / Applications tabs; nested ApplicationCard with inline status update
- `applications/page.tsx` — flat table, bulk approve/decline/move, inline status select
- `companies/page.tsx` — card grid with capacity bars
- `companies/[id]/page.tsx` — Overview / Positions / Requirements tabs
- `positions/page.tsx` — table with capacity bars + full-warning
- `positions/[id]/page.tsx` — applicant list with inline status updates
- `ibm-proofs/page.tsx` — moderation queue, ReviewDialog (approve/reject/reupload)
- `workshops/page.tsx` — card grid with type icons + engagement stats
- `courses/page.tsx` — card grid with 4-stat engagement display
- `volunteering/page.tsx` — card grid with completion rates
- `reels/page.tsx` — video grid with thumbnail + 4 engagement metrics
- `certificates/page.tsx` — table with download, resend notification, replace
- `notifications/page.tsx` — compose panel + history list; 8 audience targets
- `analytics/page.tsx` — key metrics, bar charts, export buttons
- `admins/page.tsx` — role reference table + admin user management
- `settings/page.tsx` — 6 tabbed sections (rules, IBM, notifications, capacity, branding, permissions)

**Key types:** `lib/lvn-types.ts` — Student, Application, Company, Position, IBMProof, Workshop, Course, VolunteeringOpportunity, Reel, Certificate, Notification, DashboardStats, AdminUser

**Status helpers:** `lib/status-helpers.ts` — APPLICATION_STATUS_CONFIG, IBM_PROOF_STATUS_CONFIG, formatDate, formatDateTime, capacityColor, capacityTextColor

**Design tokens:**
- Branding dark (amber): `#FFAF00` — used for CTA buttons and active sidebar
- Primary (blue): `#3581C5`  
- Background: `#F8F8F8`
- Card: white with `border border-border shadow-sm rounded-2xl`

**Pattern for data arrays from hooks:**
```ts
const items = (data?.data as Item[] | undefined) ?? [];
```
(needed because ApiResponse<T> wraps the data and TS sees status:boolean overlap)

**Why:** Built from a full prompt specifying 15 dashboard sections with operational UX for managing student internship applications, IBM proof reviews, capacity tracking, and content management.
