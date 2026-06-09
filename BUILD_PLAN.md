# VelaBeam — Build Plan

## 1. PRODUCT

VelaBeam is an AI-powered pipeline that finds local businesses with no website, generates an industry-specific, deploy-ready site in one click, and lets freelance developers and 1–5 person agencies manage every client site from a single white-label dashboard. It collapses a multi-day sales-then-build cycle into a single session: discover a prospect on the map, generate the site, preview it, hand it off. The core value is turning a freelancer's outbound hustle into an automated acquisition engine — the pain point the research makes explicit (no competitor automates prospect discovery). Primary user: a time-poor freelance web developer or small agency owner who currently juggles cold outreach, manual briefs, and WordPress installs.

## 2. WHO IT'S FOR

**Primary ICP — freelance web developers / 1–5 person agencies** building sites for local businesses. Consequences for the product:

- **Tone**: confident, operator-to-operator. No fluffy marketing copy on the dashboard. Every screen leads with an action.
- **Information density**: high. Tables, statuses, counts, filters — not a marketing site pretending to be an app.
- **White-label expectation**: every client-facing surface (preview, deploy URL, email) must accept the agency's own brand. Built into the data model from day one.
- **Time-budget UX**: the dashboard opens to a single "Today" view with one primary CTA (generate next site). No nested menus, no tour popups.
- **Money math visible**: each prospect card shows estimated MRR and one-time setup fee so the freelancer can prioritize.

**Secondary user — local business owner** receives a generated preview link, never logs in to VelaBeam. Their experience is a single hosted preview URL with the agency's branding.

## 3. LOOK & FEEL

### Visual system

- **Archetype**: Premium Studio (luxury brand) crossed with operator dashboard density. The marketing surface feels like a high-end studio; the dashboard feels like a Bloomberg terminal in serif.
- **Palette** (CSS variables, no Tailwind defaults):
  - `--ivory: #F5F1E8` — base background
  - `--charcoal: #1A1A1C` — primary text, dark surfaces
  - `--gold: #B8956A` — primary action, focus, key metrics
  - `--burgundy: #6B2737` — destructive, "needs attention" state, brand accent
  - `--mist: #E8E2D5` — borders, dividers, table stripes
  - `--fog: #9A958A` — secondary text
  - `--ink: #0E0E10` — sidebar, code blocks
- **Typography**:
  - Display/serif: `Canela`, fallback `"Cormorant Garamond", "Playfair Display", Georgia, serif` — for h1/h2, hero, page titles in marketing; for the "VelaBeam" wordmark; for KPI numbers on the dashboard.
  - Body/sans: `"Neue Haas Grotesk", "Inter", "Helvetica Neue", system-ui, sans-serif` — UI, tables, forms, buttons.
  - Mono: `"JetBrains Mono", ui-monospace, monospace` — generated code previews, slugs, deploy URLs.
- **Layout**:
  - 8px base grid. Generous whitespace in marketing; tight 4px rhythm in dashboard tables.
  - Marketing pages: max-width 1200px, centered, large serif headlines, gold hairline dividers.
  - Dashboard: persistent left sidebar (240px, `--ink` background, ivory text, gold active state), top bar (56px, ivory, hairline bottom border), main content scrolls.
- **Iconography**: `lucide-react` exclusively, 1.5px stroke, sized 16 in tables, 20 in nav, 24 in empty states. No filled icons. No emoji.
- **Imagery**: marketing only — abstract harbor photography (low-saturation, duotone charcoal/ivory) and 3D-rendered compass/beam motifs. No stock photos of people. Dashboard has zero decorative imagery.
- **Motion**:
  - Page transitions: 200ms ease-out fade.
  - Hover on cards/rows: 150ms, subtle 1px gold underline or 2% lift.
  - Primary CTA: gold-to-burgundy gradient sweep on hover, 250ms.
  - Site generation: indeterminate gold progress bar with serif step labels ("Drafting copy…", "Composing sections…", "Deploying…").
  - Respect `prefers-reduced-motion`.
- **Key components** (all built once, used everywhere):
  - `BeamButton` (primary gold, secondary ivory-outline, ghost text, danger burgundy)
  - `StudioCard` (ivory bg, 1px mist border, optional gold left bar for "featured")
  - `SerifKPI` (large Canela number, sans label, optional delta in burgundy/gold)
  - `DataTable` (sticky header, mist row dividers, monospace for IDs/dates, right-aligned numerics)
  - `Sidebar`, `Topbar`, `PageHeader` (eyebrow label + serif h1 + right-aligned actions)
  - `EmptyState` (serif headline, sans body, single gold CTA)
  - `StatusPill` (draft=gold-outline, live=gold-fill, paused=burgundy-outline, error=burgundy-fill)
  - `BeamProgress` (gold bar + serif step text)
  - `MapPin` (custom SVG map marker using `--gold`)

### Screens (top-to-bottom)

**`/sign-in` & `/sign-up`**
Split screen. Left half: full-bleed dark photograph (harbor at dusk, duotone), oversized serif wordmark, one-line tagline. Right half (ivory): centered 360px form, serif h1 ("Sign in" / "Create your studio"), sans inputs with bottom-border-only styling, gold primary button, hairline divider with "or" in serif italic, muted link to the other flow. No social logins in v1.

**`/dashboard` (Today)**
- Topbar: "VelaBeam" wordmark (left), workspace switcher (center, ivory pill), user avatar menu (right).
- Sidebar: Sections — Today, Prospects, Sites, Clients, Deploy, Brand, Billing. Active item gets a 2px gold left border and ivory text.
- Main:
  - **PageHeader**: eyebrow "TODAY · [date in serif caps]", h1 "Good evening, [first name]", right action `BeamButton` "Generate next site".
  - **KPI strip** (4 `SerifKPI` cards, ivory bg, gold underline): Pipeline value ($), Sites live, Prospects queued, Deploys this week.
  - **Two-column row**:
    - Left (8/12): "Next 5 prospects" — `DataTable` of businesses near you (name, industry, distance, est. MRR, status pill, "Generate" button). Each row hover reveals a chevron; click opens a slide-over.
    - Right (4/12): "Activity" — vertical timeline (sans 13px), most recent first. Generation complete, deploy succeeded, prospect added.
  - **Below**: "Recently generated" — horizontal scroll of 3 `StudioCard` thumbnails (1280×800 iframe screenshot, gold hover border), each with industry tag and live/preview status.

**`/dashboard/prospects`**
- Header: h1 "Prospects", right cluster: search input, industry filter (multi-select chip row), radius slider, "Refresh leads" gold button.
- Toggle: **Map** | **Table** (default Table for ICP).
- **Table view**: Name, Industry, Address, Distance, Has site? (No = burgundy pill), Est. MRR, Last seen, Actions (`Generate`, `Dismiss`, `Open in Maps`).
- **Map view**: full-bleed dark map (MapLibre + dark style), gold `MapPin` markers clustered, side panel slides in on click with same data and a primary "Generate site" CTA.
- Empty state: serif "No prospects in range", sans "Increase your radius or refresh leads.", gold "Refresh leads".

**`/dashboard/prospects/[id]` (slide-over from list)**
Two columns. Left: business details, Google Places data, owner contact (if available), "Why we picked it" (3 bullets generated by AI). Right: "Generate site" panel — industry auto-detected, template preview thumbnails, `BeamButton` "Generate site" triggers the flow.

**`/dashboard/sites`**
- Header: h1 "Sites", filter chips by status (All, Draft, Live, Paused, Error), industry, client.
- Grid of `StudioCard` thumbnails (3 per row, 16:10 ratio). Each card: screenshot, top-left status pill, bottom overlay with client name (serif) and domain (mono). Click → detail page.
- "New site" card (dashed gold border, serif "Create from scratch" + plus icon).

**`/dashboard/sites/[id]`**
- Header: client name (serif h1), domain (mono), status pill, right actions: `Preview`, `Pause`, `Transfer`, `Open admin`.
- Tabs: **Preview** (iframe of live site, address bar mockup with agency domain), **Editor** (placeholder for v1), **Activity**, **Billing** (MRR, last invoice, "Manage" link), **Settings** (white-label overrides, deploy region, custom domain).

**`/dashboard/clients`**
- Table: Client name, Sites, MRR, Owner email, Created, Actions.
- "Add client" opens a modal with name, email, notes.

**`/dashboard/deploy`**
Single page, intentionally sparse. h1 "Deploy", sans body explaining the deploy pipeline (4 numbered steps in serif numerals: Discover → Generate → Preview → Deploy). A `BeamProgress` widget showing the most recent batch job. Below: a log table (timestamp, level, message, site id) — mono font, last 200 lines, auto-refresh every 5s.

**`/dashboard/brand`** (white-label)
- Form: agency name (used everywhere client-facing), logo upload (preview), primary color (defaults to gold), support email, custom domain (CNAME instructions in a mono code block with a "Copy" button), remove "Powered by VelaBeam" toggle ($).
- Live preview iframe of the client's preview page in your branding.

**`/dashboard/billing`**
- Current plan card (serif plan name, sans price, gold "Upgrade" button if not on top tier).
- Invoice table (date, amount, status, PDF).
- Payment method (last 4, brand, expiry).

**`/dashboard/settings`**
Profile, password, sessions, workspace members (invite by email, role: owner/editor/viewer), delete workspace (burgundy, double-confirm).

**Marketing pages**

- **`/`** (home): Full-bleed hero, harbor duotone background, oversized Canela headline ("The beam that finds, builds, and ships your next client."), sans subhead, two CTAs ("Start free" gold, "See pricing" ivory-outline). Below: 3-up value props in `StudioCard`s with serif numerals (I. Discover, II. Generate, III. Deploy). Social proof row intentionally omitted (no fake logos). Pricing teaser → `/pricing`. Footer with hairline gold rule, four columns.
- **`/features`**: Long-form, serif H2s, alternating image-left/image-right rows, gold "request access" CTA at end.
- **`/pricing`**: Two cards side-by-side on desktop, stacked on mobile. **Agency** ($99/mo Studio, $199/mo Atelier — latter is the "recommended" gold-bordered card) and **Business hosting** ($19/mo Starter, $39/mo Growth). Feature comparison table beneath, monospace for "—" in unavailable cells. FAQ accordion at bottom (5 questions).
- **`/about`**: Short studio story, no fake team photos, name placeholders ("Studio of N" — replace when real).
- **`/contact`**: Single form, sans inputs, no phone number.

## 4. USER FLOWS

### Flow A — First-run onboarding (post-signup)
1. User submits `/sign-up` (email + password + workspace name).
2. Redirected to `/onboarding` (3 steps, progress dots, no sidebar):
   - Step 1: "Where do you work?" — address autocomplete, default radius 25mi.
   - Step 2: "What industries?" — multi-select chips (Restaurant, Dental, Legal, Salon, Auto, Real Estate, Fitness, Other). At least 1 required.
   - Step 3: "Your brand" — agency name (prefilled), logo upload optional, primary color picker (default gold).
3. Click "Find prospects" → `POST /api/prospects/scan` enqueues a job, redirects to `/dashboard/prospects` with a `BeamProgress` banner at top: "Scanning your area…". On completion, table populates.
4. States: empty (no results yet — `BeamProgress`), partial (some rows, banner still showing), complete (banner dismisses, success toast "12 prospects found").

### Flow B — Generate a site
1. From `/dashboard` or `/dashboard/prospects`, click `Generate` on a row.
2. Slide-over opens with industry detected, 3 template thumbnails (selected by industry). User picks one, clicks `Generate site` (gold).
3. Modal appears with `BeamProgress`: 4 steps ("Analyzing business" → "Drafting copy" → "Composing sections" → "Publishing preview"). Each step ~5–15s. ETA in serif.
4. On success, toast "Preview ready", button "Open preview" navigates to `/dashboard/sites/[id]?tab=preview`.
5. States: generating (progress modal, cannot close), success (toast + redirect), error (burgundy banner in modal, "Retry" button preserves template choice), partial (preview generated but assets failed — warning pill on site card).

### Flow C — Deploy to a custom domain
1. From `/dashboard/sites/[id]`, click `Transfer` → modal with domain input.
2. After submit, site status becomes `Pending DNS` (gold-outline pill). The modal shows CNAME instructions in a mono code block with copy button.
3. A background job polls DNS; on success, status flips to `Live` and a confetti-free toast appears.
4. States: pending, verified, failed (burgundy pill + diagnostic message in `Activity` tab).

### Flow D — White-label a client preview
1. `/dashboard/brand` → upload logo, set color, toggle "Powered by" off.
2. "Live preview" iframe at bottom refreshes on each change.
3. All new client preview URLs immediately use the new brand. No rebuild.

### Flow E — Sign in
`/sign-in` → NextAuth credentials → redirect to `/dashboard` (or `/onboarding` if no scan run yet). Failed: inline burgundy helper under the field. Rate-limited: full-form banner.

## 5. PAGES / ROUTES

| Route | Purpose | Auth | Layout |
|---|---|---|---|
| `/` | Marketing home | Public | Marketing shell (header + footer) |
| `/features` | Marketing features | Public | Marketing shell |
| `/pricing` | Marketing pricing | Public | Marketing shell |
| `/about` | Marketing about | Public | Marketing shell |
| `/contact` | Marketing contact | Public | Marketing shell |
| `/sign-in` | Auth | Public | Split-screen auth |
| `/sign-up` | Auth + workspace create | Public | Split-screen auth |
| `/onboarding` | 3-step first-run | Auth | Minimal shell, no sidebar |
| `/dashboard` | Today view | Auth | Dashboard shell (sidebar + topbar) |
| `/dashboard/prospects` | Lead discovery | Auth | Dashboard shell |
| `/dashboard/prospects/[id]` | Prospect detail (slide-over) | Auth | Dashboard shell + slide-over |
| `/dashboard/sites` | All sites grid | Auth | Dashboard shell |
| `/dashboard/sites/[id]` | Site detail (tabbed) | Auth | Dashboard shell |
| `/dashboard/clients` | Clients table | Auth | Dashboard shell |
| `/dashboard/deploy` | Deploy pipeline + logs | Auth | Dashboard shell |
| `/dashboard/brand` | White-label settings | Auth | Dashboard shell |
| `/dashboard/billing` | Plan + invoices | Auth | Dashboard shell |
| `/dashboard/settings` | Workspace settings | Auth | Dashboard shell |
| `/preview/[token]` | Public client preview (white-labeled) | Public (token) | Minimal, branded |
| `/api/auth/[...nextauth]` | NextAuth handler | — | — |
| `/api/prospects/scan` | POST: enqueue scan | Auth | — |
| `/api/prospects` | GET: list (filterable) | Auth | — |
| `/api/sites` | GET list, POST create | Auth | — |
| `/api/sites/[id]` | GET, PATCH, DELETE | Auth | — |
| `/api/sites/[id]/generate` | POST: trigger generation | Auth | — |
| `/api/sites/[id]/deploy` | POST: deploy/transfer | Auth | — |
| `/api/brand` | GET/PATCH white-label | Auth | — |
| `/api/upload` | POST: logo/asset | Auth | — |
| `/api/billing/checkout` | POST: create checkout session | Auth | — |
| `/api/billing/webhook` | POST: Stripe webhook | Signature | — |

## 6. CORE FEATURES

1. **NextAuth.js v5 authentication** — Credentials provider (email + password, bcrypt), JWT session strategy, 7-day expiry, rotating refresh. Workspace is created on signup and linked to the user. Middleware (`middleware.ts`) protects every `/dashboard/*` and `/onboarding` route; unauthenticated users hit `/sign-in?next=…`. Rate-limit `/api/auth/*` at 10 req/min/IP.
2. **Workspace & members** — One workspace per signup (multi-tenant). Members: `owner`, `editor`, `viewer`. Invites by email, 7-day token, single-use. Owner-only access to billing and workspace delete.
3. **Lead discovery (Prospects)** — User defines a center point and radius (default 25mi, max 100mi) plus industry filters. The scan calls Google Places API (or a stub provider in dev) for businesses matching categories, then filters out those with a working website (HTTP 200 + non-parking-page heuristic). Results stored in `prospects` table with `has_website: false`, `est_mrr` (calculated from industry × local competition), `last_seen`, `source`. Manual "Refresh leads" re-runs; results are upserted, not duplicated. Map view uses MapLibre with a dark style; markers are clustered at low zoom.
4. **AI site generator** — Given a prospect, the system picks one of 8 industry templates (Restaurant, Dental, Legal, Salon, Auto, Real Estate, Fitness, General) and calls an LLM with a structured prompt to produce: business name, tagline, 5 section blocks (hero, services, about, testimonials placeholder, contact), color override respecting white-label palette, image prompts. Generation is a background job (BullMQ + Redis in prod, in-process queue in dev). Progress is streamed to the client via Server-Sent Events on `/api/sites/[id]/generate/stream`. The site is rendered to Next.js + a `StudioRenderer` component that maps JSON sections to a fixed template — no raw LLM HTML reaches the browser.
5. **Site preview (`/preview/[token]`)** — A signed URL (24h expiry by default) renders the generated site using the workspace's white-label config. No VelaBeam branding unless toggled on. Includes a sticky "Built by [agency]" footer with mailto link.
6. **White-label branding** — Stored at workspace level: `agency_name`, `logo_url`, `primary_color` (overrides gold), `support_email`, `hide_powered_by` (boolean, gates the Studio plan). Applied server-side at render time, never via client override.
7. **Deploy / transfer** — A site starts as `draft` (only accessible via preview token). User enters a custom domain; we issue a CNAME target, mark `pending_dns`, and a background poller (`/api/cron/dns` invoked every 60s) verifies DNS. On success, status `live`; the site is served at the custom domain via a Vercel rewrite keyed on the `domains` table (or, in dev, served from `/preview/[token]` only). `Pause` flips to `paused`; `Transfer` initiates ownership change to the client.
8. **Billing (Stripe)** — Two product families: Agency (Studio $99, Atelier $199) and Business hosting (Starter $19, Growth $39). Checkout via `POST /api/billing/checkout` returns a Stripe Checkout URL. Webhook updates `subscriptions` table. Invoice history pulled from Stripe and mirrored locally. **In v1, Stripe is wired but calls return a 501 unless `STRIPE_SECRET_KEY` is set** — the UI must work with a "Billing not configured" empty state so the build is honest.
9. **Activity log** — Every generation, deploy, status change, invite, and login writes to `activity_events` (actor, type, target, payload jsonb, created_at). Surfaces in `/dashboard/deploy` and per-site `Activity` tab.
10. **Search & filters** — Server-side filter+sort on every table (Prospects, Sites, Clients). URL-driven query params so views are shareable.
11. **Empty states everywhere** — No fake data. Every empty list shows a serif headline, one-line sans body, and a single gold CTA.
12. **Accessibility** — All interactive elements keyboard-reachable, visible focus ring (2px gold), `aria-label` on icon-only buttons, color contrast ≥ AA against ivory and ink.
13. **Reduced motion & dark surface** — All animations gated by `prefers-reduced-motion`. The dashboard "ink" sidebar acts as the only permanent dark surface; main content stays ivory to keep the studio feel.

## 7. DATA MODEL

**`users`** — `id (uuid pk)`, `email (unique, citext)`, `password_hash`, `name`, `avatar_url`, `email_verified_at`, `created_at`, `updated_at`.

**`workspaces`** — `id (uuid pk)`, `name`, `owner_id (fk users)`, `plan ('studio'|'atelier'|'starter'|'growth'|null)`, `stripe_customer_id`, `created_at`, `updated_at`.

**`workspace_members`** — `workspace_id (fk)`, `user_id (fk)`, `role ('owner'|'editor'|'viewer')`, `invited_by`, `joined_at`, `pk(workspace_id,user_id)`.

**`brand_profiles`** — `workspace_id (fk pk)`, `agency_name`, `logo_url`, `primary_color (default #B8956A)`, `support_email`, `hide_powered_by (bool)`, `updated_at`.

**`prospects`** — `id (uuid pk)`, `workspace_id (fk)`, `external_place_id (unique per workspace)`, `name`, `industry`, `address`, `lat`, `lng`, `phone`, `website_url (nullable)`, `has_website (bool)`, `rating`, `review_count`, `est_mrr_cents`, `status ('new'|'queued'|'generated'|'dismissed')`, `last_seen_at`, `created_at`.

**`clients`** — `id (uuid pk)`, `workspace_id (fk)`, `name`, `owner_email`, `notes`, `created_at`.

**`sites`** — `id (uuid pk)`, `workspace_id (fk)`, `client_id (fk nullable)`, `prospect_id (fk nullable)`, `industry`, `template_key`, `name`, `slug`, `status ('draft'|'pending_dns'|'live'|'paused'|'error')`, `content_json (jsonb — sections)`, `preview_token (unique)`, `created_at`, `updated_at`, `deployed_at`.

**`domains`** — `id (uuid pk)`, `site_id (fk unique)`, `hostname (unique)`, `cname_target`, `verified_at`, `last_checked_at`, `last_error`.

**`generation_jobs`** — `id (uuid pk)`, `site_id (fk)`, `status ('queued'|'running'|'succeeded'|'failed')`, `step ('analyze'|'copy'|'sections'|'publish')`, `progress (int 0-100)`, `error`, `started_at`, `finished_at`.

**`subscriptions`** — `workspace_id (fk pk)`, `stripe_subscription_id`, `status`, `current_period_end`, `price_id`, `product ('agency'|'hosting')`.

**`invoices`** — `id (uuid pk)`, `workspace_id (fk)`, `stripe_invoice_id`, `amount_cents`, `currency`, `status`, `pdf_url`, `issued_at`.

**`activity_events`** — `id (uuid pk)`, `workspace_id (fk)`, `actor_id (fk users)`, `type`, `target_type`, `target_id`, `payload (jsonb)`, `created_at`.

**`sessions`** — managed by NextAuth adapter (database strategy) or JWT — pick **JWT** to keep the schema lean.

## 8. AUTH

- **NextAuth.js v5** (`next-auth@5`), `CredentialsProvider` only in v1.
- Password hashing: `bcryptjs` (12 rounds).
- Session: JWT, 7-day expiry, secure+httpOnly cookie.
- `middleware.ts` runs `auth()` from `auth.ts` and protects `/dashboard/*`, `/onboarding`, and all `/api/*` except `/api/auth/*` and `/api/billing/webhook`.
- On successful signup, a `workspace` row is created in the same transaction as the `user` row, and the user is assigned `owner` in `workspace_members`.
- Rate limit: simple in-memory token bucket in dev, Upstash Redis in prod. Applied to `/api/auth/*` and `/api/prospects/scan`.
- **No Clerk anywhere.** `package.json` must not contain `@clerk/*`.

## 9. FILES

```
app/
  layout.tsx
  globals.css
  (marketing)/
    layout.tsx
    page.tsx
    features/page.tsx
    pricing/page.tsx
    about/page.tsx
    contact/page.tsx
  (auth)/
    layout.tsx
    sign-in/page.tsx
    sign-up/page.tsx
  (app)/
    layout.tsx
    onboarding/page.tsx
    dashboard/
      layout.tsx
      page.tsx
      prospects/page.tsx
      prospects/[id]/page.tsx
      sites/page.tsx
      sites/[id]/page.tsx
      clients/page.tsx
      deploy/page.tsx
      brand/page.tsx
      billing/page.tsx
      settings/page.tsx
    preview/[token]/page.tsx
  api/
    auth/[...nextauth]/route.ts
    prospects/route.ts
    prospects/scan/route.ts
    sites/route.ts
    sites/[id]/route.ts
    sites/[id]/generate/route.ts
    sites/[id]/generate/stream/route.ts
    sites/[id]/deploy/route.ts
    clients/route.ts
    brand/route.ts
    upload/route.ts
    billing/checkout/route.ts
    billing/webhook/route.ts
    cron/dns/route.ts
components/
  ui/
    BeamButton.tsx
    StudioCard.tsx
    SerifKPI.tsx
    DataTable.tsx
    StatusPill.tsx
    BeamProgress.tsx
    EmptyState.tsx
    PageHeader.tsx
    Sidebar.tsx
    Topbar.tsx
    MapPin.tsx
  marketing/
    Hero.tsx
    ValuePropRow.tsx
    PricingCards.tsx
    PricingTable.tsx
    FAQ.tsx
    Footer.tsx
  auth/
    SignInForm.tsx
    SignUpForm.tsx
  onboarding/
    StepLocation.tsx
    StepIndustries.tsx
    StepBrand.tsx
  dashboard/
    TodayView.tsx
    ProspectTable.tsx
    ProspectMap.tsx
    ProspectSlideOver.tsx
    SitesGrid.tsx
    SiteDetailTabs.tsx
    ClientsTable.tsx
    DeployLog.tsx
    BrandForm.tsx
    BillingPanel.tsx
    SettingsForm.tsx
  studio/
    StudioRenderer.tsx
    templates/Restaurant.tsx
    templates/Dental.tsx
    templates/Legal.tsx
    templates/Salon.tsx
    templates/Auto.tsx
    templates/RealEstate.tsx
    templates/Fitness.tsx
    templates/General.tsx
lib/
  auth.ts
  db.ts
  env.ts
  rate-limit.ts
  stripe.ts
  places.ts
  llm.ts
  dns.ts
  jobs.ts
  tokens.ts
  activity.ts
  pricing.ts
  industry.ts
  cn.ts
  format.ts
types/
  next-auth.d.ts
  db.ts
  api.ts
styles/
  tokens.css
  fonts.ts
public/
  fonts/  (self-hosted Canela + Neue Haas Grotesk woff2)
  images/harbor-1.jpg, harbor-2.jpg
  logos/vb-mark.svg
middleware.ts
auth.ts
next.config.mjs
tailwind.config.ts
package.json
.env.example
README.md
db/schema.sql
db/seed.ts
```

## 10. ACCEPTANCE

- [ ] `npm run dev` boots with no TypeScript errors and no `next-auth` runtime warnings.
- [ ] `package.json` contains **zero** `@clerk/*` packages; `next-auth@5` is installed and configured.
- [ ] Sign up creates a `user`, `workspace`, and `workspace_members` row in one transaction; the user is signed in immediately.
- [ ] Unauthenticated visit to `/dashboard` redirects to `/sign-in?next=/dashboard`.
- [ ] Onboarding flow is gated until a scan has been run; direct visit to `/dashboard` before onboarding redirects to `/onboarding`.
- [ ] Prospect scan returns ≥ 1 row when a valid Google Places key is configured; returns a clear "configure provider" empty state when not.
- [ ] Map view renders with dark MapLibre style and gold cluster markers.
- [ ] Site generation streams progress via SSE and lands on a `/dashboard/sites/[id]?tab=preview` with a working iframe pointing at `/preview/[token]`.
- [ ] Preview URL renders with the workspace's agency name, logo, and primary color; toggling `hide_powered_by` immediately removes the footer line on the next page load.
- [ ] Deploying a custom domain flips status to `pending_dns` and shows CNAME instructions; a mock DNS verifier can flip it to `live`.
- [ ] All dashboard tables support filter, sort, and URL-driven state.
- [ ] No fake testimonials, customer logos, user counts, ratings, or press quotes anywhere. All empty states are honest.
- [ ] Stripe checkout endpoint returns 501 unless `STRIPE_SECRET_KEY` is set; the billing page shows a "Billing not configured" empty state in that case.
- [ ] Color tokens are CSS variables only; no hex literals in component files.
- [ ] All animations respect `prefers-reduced-motion`.
- [ ] Lighthouse a11y score ≥ 95 on `/`, `/sign-in`, `/dashboard`.
- [ ] All forms have labels, error messages, and keyboard submission.
- [ ] `middleware.ts` blocks every `/dashboard/*` and `/api/*` route except the allowlist.

FILES: ["app/layout.tsx", "app/globals.css", "app/(marketing)/layout.tsx", "app/(marketing)/page.tsx", "app/(marketing)/features/page.tsx", "app/(marketing)/pricing/page.tsx", "app/(marketing)/about/page.tsx", "app/(marketing)/contact/page.tsx", "app/(auth)/layout.tsx", "app/(auth)/sign-in/page.tsx", "app/(auth)/sign-up/page.tsx", "app/(app)/layout.tsx", "app/(app)/onboarding/page.tsx", "app/(app)/dashboard/layout.tsx", "app/(app)/dashboard/page.tsx", "app/(app)/dashboard/prospects/page.tsx", "app/(app)/dashboard/prospects/[id]/page.tsx", "app/(app)/dashboard/sites/page.tsx", "app/(app)/dashboard/sites/[id]/page.tsx", "app/(app)/dashboard/clients/page.tsx", "app/(app)/dashboard/deploy/page.tsx", "app/(app)/dashboard/brand/page.tsx", "app/(app)/dashboard/billing/page.tsx", "app/(app)/dashboard/settings/page.tsx", "app/(app)/preview/[token]/page.tsx", "app/api/auth/[...nextauth]/route.ts", "app/api/prospects/route.ts", "app/api/prospects/scan/route.ts", "app/api/sites/route.ts", "app/api/sites/[id]/route.ts", "app/api/sites/[id]/generate/route.ts", "app/api/sites/[id]/generate/stream/route.ts", "app/api/sites/[id]/deploy/route.ts", "app/api/clients/route.ts", "app/api/brand/route.ts", "app/api/upload/route.ts", "app/api/billing/checkout/route.ts", "app/api/billing/webhook/route.ts", "app/api/cron/dns/route.ts", "components/ui/BeamButton.tsx", "components/ui/StudioCard.tsx", "components/ui/SerifKPI.tsx", "components/ui/DataTable.tsx", "components/ui/StatusPill.tsx", "components/ui/BeamProgress.tsx", "components/ui/EmptyState.tsx", "components/ui/PageHeader.tsx", "components/ui/Sidebar.tsx", "components/ui/Topbar.tsx", "components/ui/MapPin.tsx", "components/marketing/Hero.tsx", "components/marketing/PricingCards.tsx", "components/marketing/Footer.tsx", "components/auth/SignInForm.tsx", "components/auth/SignUpForm.tsx", "components/onboarding/StepLocation.tsx", "components/onboarding/StepIndustries.tsx", "components/onboarding/StepBrand.tsx", "components/dashboard/TodayView.tsx", "components/dashboard/ProspectTable.tsx", "components/dashboard/ProspectMap.tsx", "components/dashboard/ProspectSlideOver.tsx", "components/dashboard/SitesGrid.tsx", "components/dashboard/SiteDetailTabs.tsx", "components/dashboard/DeployLog.tsx", "components/dashboard/BrandForm.tsx", "components/studio/StudioRenderer.tsx", "components/studio/templates/Restaurant.tsx", "components/studio/templates/Dental.tsx", "lib/auth.ts", "lib/db.ts", "lib/env.ts", "lib/rate-limit.ts", "lib/stripe.ts", "lib/places.ts", "lib/llm.ts", "lib/dns.ts", "lib/jobs.ts", "lib/tokens.ts", "lib/activity.ts", "lib/pricing.ts", "lib/industry.ts", "middleware.ts", "auth.ts", "styles/tokens.css", "db/schema.sql"]