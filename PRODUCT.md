# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Owner / Admin:** Full operational control — manages inventory, reviews and exports sales reports (daily/monthly as Excel), manages users and branches, controls all data. Single admin login.
- **Teachers:** Log in with admin-provided credentials to upload video lessons and tasks for students. Also use a shift clock-in/clock-out system that records entry and departure times.
- **Students (Elementary through High School, ages ~5–18):** Browse available lessons and tasks (no access to payments or admin dashboard). Browse the library store catalog, add items to a basket, and check out with a live payment method.

## Product Purpose

DashLib is the operations hub for a multi-branch educational library store (2–3 branches). It sells books, school supplies, and student materials, while also serving as a learning platform where teachers upload lessons and tasks for students.

Success means:
- Admins can see real-time sales data, manage inventory across branches, transfer supplies between locations, and export reports without friction.
- Teachers can upload educational content and track their attendance with minimal overhead.
- Students can browse learning materials and shop for supplies in a clear, age-appropriate interface with working checkout.
- All data is real-time across roles and branches.

## Positioning

A unified storefront + learning + operations platform purpose-built for educational library stores — combining retail (POS/inventory/branch transfers), LMS-lite (lessons, tasks), and workforce management (shift tracking) in one system, rather than stitching together separate tools.

## Operating Context

- 2–3 physical library-store branches; supply transfers happen between them.
- Teachers clock in at the start of their shift and clock out when leaving; timestamps are recorded.
- Sales reports are reviewed daily and monthly, exported as Excel sheets.
- Inventory and sales data must be real-time to reflect for both customers browsing the store and workers managing it.
- Students range from elementary to high school — the interface must work for younger children while not feeling childish to older students.

## Capabilities and Constraints

### Confirmed capabilities
- **Sales dashboard:** Daily and monthly sales analytics, exportable as Excel.
- **Inventory management:** Product catalog (books, supplies, materials), stock levels across branches.
- **Branch transfer:** Move supplies between 2–3 branches with tracking.
- **Teacher portal:** Upload video lessons and tasks for students; shift clock-in/clock-out with time capture.
- **Student portal:** Browse lessons and tasks; browse store catalog; add to basket; live payment checkout.
- **User management:** Admin manages teacher accounts and access.
- **Authentication:** Clerk Auth (all roles).
- **Database:** Supabase (real-time). User will configure — frontend provides the integration points.

### Constraints
- Frontend-only build: Supabase schema and configuration are the user's responsibility. Build the UI with placeholder data and clear integration points.
- Content is templated: use realistic substitute content; the user will replace with real data.
- Payment integration method is undecided — build the checkout flow UI and leave the payment provider integration point open.

## Brand Commitments

- **Name:** DashLib
- **Logo:** `src/app/favicon.ico` (existing asset)
- **Color palette:** Havan (warm beige-tan), white, green, red, black, light gray — binding constraint.

## Evidence on Hand

- Logo exists as favicon.ico. No other brand assets, imagery, or real content are provided yet.
- No real product catalog, teacher accounts, or student data. All content will be substitute/template data until the user populates it.

## Product Principles

1. **Real-time truth:** Every screen reflects live data — no stale numbers, no manual refresh. Workers and customers see the same reality.
2. **Role-appropriate access:** Each user sees exactly what they need — admins get the full picture, teachers get their tools, students get a clean learning and shopping experience.
3. **Multi-branch coherence:** Branch transfers, cross-location inventory, and consolidated reporting work as first-class features, not afterthoughts.
4. **Age-spanning clarity:** The interface serves 5-year-olds browsing lessons and 18-year-olds checking out supplies — clear, intuitive, never patronizing.
5. **Operational velocity:** Clock-in, upload, transfer, export — every daily task completes in minimal steps.

## Accessibility & Inclusion

- Age range spans elementary to high school: UI must be navigable by younger children (large touch targets, clear iconography, simple language in student-facing areas) while remaining efficient for adult admin/teacher workflows.
- No specific WCAG level was established, but the student age range and educational context make accessibility a practical requirement.
