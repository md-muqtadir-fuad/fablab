# BUET FabLab

A responsive Next.js website with persistent member accounts, equipment booking requests, project discovery, service enquiries, private design-file uploads, and staff review.

## Run

Requires Node.js 22 or newer and npm. This app needs a Node server; it is not a static export.

```sh
npm install
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
npm run db:setup                # creates tables, the first admin account, and sample notices
npm run dev
```

Open http://localhost:3000. The database is a SQLite file at `.data/fablab.sqlite` and uploaded notice files go to `storage/`. Neither is committed; back them up together. Do not commit `.env.local`, database files or uploads.

`npm run db:setup` is safe to run again: it applies new database changes, skips existing accounts and only adds sample notices to an empty notice board. Use `npm run db:setup -- --no-seed` on a real server.

## Working features

- Notice board at `/notices` with categories, search, pagination, pinning, scheduling, expiry dates and PDF/image attachments, managed by staff at `/admin/notices` (status tabs, search, and private previews of drafts). The three newest notices appear on the homepage.
- Account registration, password sign-in, seven-day HTTP-only sessions and sign-out.
- Equipment search, category/facility/status filters, alphabetical and rate sorting.
- Booking wizard with preserved step values, current slot availability, working-day validation, Thursday hours, machine restrictions, server-calculated estimates and safety agreement.
- Atomic slot holds prevent duplicate pending/approved bookings. Reservations require staff approval; registration does not grant certification.
- Optional STL, STEP, STP, DXF and PDF attachments up to 10 MB, stored privately and downloadable by their owner or authorised staff.
- Member dashboard with saved bookings, attached files, request status and cancellation at least 24 hours before a session.
- Training course selection, visit date/group-size validation, fabrication briefs, project briefs, consultation, research and industry enquiries.
- Staff dashboard at `/admin` for approving, rejecting and completing bookings and service requests.
- Searchable project gallery, equipment/project details, all public information pages, Bangla help, keyboard navigation, responsive menu, loading/error/404 states, sitemap and robots rules.
- Downloaded BUET, UGC, World Bank and HEAT footer logos. Sources are recorded in `public/logos/SOURCES.md`.

## Staff setup

Staff roles are stored on each account: `admin` (bookings, requests and all content) or `editor` (content only). `npm run db:setup` creates the first admin; it asks for the email and password, or reads `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME`. Running it for an existing email makes that account an admin without changing its password. Emails listed in `ADMIN_EMAILS` are also treated as admins and cannot register through the public form.

Sign in normally, then open `/admin`.

For lost passwords, an authorised database operator must reset the account using a fresh scrypt salt/hash and revoke its sessions. Self-service password recovery needs an institutional identity or verified email service, which is not configured here.

## Content features switch

`ENABLE_ADMIN=true` switches on the notice board (public pages, homepage strip, header and footer links, and the admin pages). When it is unset or `false`, those parts are hidden and the rest of the site works exactly as before, so unfinished content features can be merged safely. Public notice pages show an empty board instead of failing if the database is unreachable.

## Deployment configuration

- `APP_URL`: exact public origin, e.g. `https://fablab.example.edu`. Write requests enforce matching Origin headers.
- `ENABLE_ADMIN`: `true` to switch on the notice board and its admin pages.
- `DATABASE_PATH`: persistent SQLite file, on a local disk mounted to the Node server (default `.data/fablab.sqlite`).
- `DATABASE_URL` and `DATABASE_AUTH_TOKEN`: use a Turso/libSQL database instead of the local file (needed on Vercel or other serverless hosting). Run `npm run db:setup` once with these set.
- `STORAGE_DIR`: folder for uploaded notice files (default `storage`). On Vercel set `BLOB_READ_WRITE_TOKEN` instead and files go to Vercel Blob.
- `ADMIN_EMAILS`: optional comma-separated addresses that are always admins.
- `COOKIE_SECURE`: `true` over HTTPS. `false` is only for local HTTP testing; production defaults to secure cookies when omitted.

```sh
npm run build
npm start
```

For standalone hosting, copy `public` and `.next/static` into the standalone bundle before running its server. Use a single application instance with persistent disk. SQLite/WAL files, booking uploads (stored in the database) and the `storage/` folder must be backed up together using a SQLite-aware backup process. An ephemeral/serverless filesystem will lose submissions unless `DATABASE_URL` (Turso) and `BLOB_READ_WRITE_TOKEN` (Vercel Blob) are set. Notice attachments are limited to 4 MB so uploads stay under Vercel's request size limit.

## Operational limits

The supplied machine inventory, machine states, rates, project examples, impact metrics and images remain sample content. Replace these with verified institutional records before publication. The booking calendar itself reads real saved reservations. Estimates use the external machine rate until staff verify internal-rate eligibility; material charges require a separate quote.

This app uses local password accounts. Email ownership, BUET membership and certifications are not automatically verified. No institutional SSO, payment processing, automatic email or SMS delivery is configured. Public forms really save requests; they do not claim an email was sent. Staff can review requests in `/admin`, and signed-in members can track them in `/dashboard`. Anonymous enquiries remain visible to staff and return a reference to the visitor.

Review institutional contact details, public content, operating hours, data retention, funding/partner descriptions and service policy before launch. Submitted records remain until the operator removes them. Apply deployment-level request throttling and storage quotas appropriate to expected traffic; application routes also enforce payload limits and rate limits.

## Quality checks

Every pull request runs these automatically on GitHub (`.github/workflows/ci.yml`). To run them yourself:

```sh
npm run lint
npm run build
npm run typecheck
npm test
npm audit
```

Browser tests use installed Google Chrome in headless mode, start a production server on port 3100 with the notice board switched on, create a fresh `.data/test-*.sqlite` database and storage folder, and provision a test-only staff account. Build first with `NEXT_DIST_DIR=.next-verify npm run build`. The tests do not use the normal application database. Screenshots and failure traces are written to `test-results/`.

The suite covers the notice board (publishing, attachments, drafts, scheduling, deletion, validation, access control and storage path safety), public routes and links, responsive layouts, search/sort, registration, wizard state, uploads, persistence, cancellation, all enquiry types, duplicate-slot races, closed days, maintenance, origin checks, private-file access and staff authorisation. See `BUG_HUNT.md` for the final results and findings.
