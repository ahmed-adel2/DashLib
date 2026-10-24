# DashLib

The operations hub for a multi-branch educational library store: a student storefront,
a lesson library, teacher tools and the admin back office, sharing one catalog and one set
of branch numbers.

This is a **front-end build**. Product, sales, lesson and shift data are realistic sample
records; Clerk, Supabase and a payment provider are the three integration points that turn
it live.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. `next/font` fetches Amiri and Rubik at build time, so the first
run needs network access.

## Routes

| Route | Role | What it does |
| --- | --- | --- |
| `/` | Student | Catalog with search, category/grade filters, per-branch stock, basket |
| `/product/[slug]` | Student | Product detail, branch stock table, add to basket |
| `/basket` | Student | Quantities, totals, checkout entry |
| `/checkout` | Student | Pickup details → payment method → review → place order |
| `/checkout/confirmed` | Student | Order receipt with reference and pickup instructions |
| `/learn` | Student | Lesson library and tasks due this week |
| `/learn/[slug]` | Student | Lesson outline, materials, attached task submission |
| `/teacher` | Teacher | Shift clock, week summary, lessons and tasks to mark |
| `/teacher/lessons` | Teacher | Lesson library and upload form |
| `/teacher/tasks` | Teacher | Open tasks and task composer |
| `/teacher/hours` | Teacher | Shift records and weekly hours chart |
| `/admin` | Admin | Sales overview, revenue chart, branch split, orders, alerts |
| `/admin/inventory` | Admin | Stock per branch with adjustments and low-stock filter |
| `/admin/transfers` | Admin | Branch transfers with create and receive |
| `/admin/reports` | Admin | Daily/monthly reports and Excel export |
| `/admin/staff` | Admin | Accounts, roles, invites, access control |
| `/admin/branches` | Admin | Branch overview and network totals |
| `/sign-in` | All | Demo role chooser (Clerk replacement) |

## Integration points

- **Supabase** — `src/lib/data.ts` holds one typed sample dataset standing in for the
  queries (products, orders, lessons, tasks, shifts, transfers, profiles). Replace the
  exports with `createClient()` reads; subscribe to `orders`, `stock_levels` and
  `transfers` for realtime updates.
- **Clerk** — `/sign-in` routes by role for the preview. Wire Clerk, then read the role
  claim in the portal layouts and protect `/admin/*` and `/teacher/*`.
- **Payments** — `src/lib/payments.ts` is the single call the checkout makes. Move intent
  creation to a route handler when a provider is chosen; never ship a secret key here.
- **Lesson media** — the upload form records a file name only. Point it at Supabase Storage
  and write the lesson row when the upload completes.

Student-facing state (basket, shift clock, task submissions, placed order) persists in
`localStorage`/`sessionStorage` so the flows can be used end to end today.

## Design and structure

- World and tokens: `DESIGN.md`; surface contract: `.impeccable/briefs/student-store.md`
- Tokens and shared CSS: `src/styles/globals.css` (Tailwind v4 `@theme`)
- Primitives: `src/components/ui.tsx`, icons: `src/components/icons.tsx`
- Authored cover art: `src/components/product-art.tsx`, `src/components/lesson-thumb.tsx`
- Excel export (no dependency): `src/lib/export.ts` writes a multi-sheet `.xls` workbook
