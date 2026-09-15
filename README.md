# BUET FabLab

A responsive Next.js website with persistent member accounts, equipment booking requests, project discovery, service enquiries, private design-file uploads, and staff review.

## Run

Requires Node.js 22 or newer and npm. This app needs a Node server and persistent writable disk; it is not a static export.

```sh
npm install
npm run dev
```

Open http://localhost:3000. SQLite is created automatically at `.data/fablab.sqlite`. Copy `.env.example` to `.env.local` to configure the deployment. Do not commit database files, uploaded files, credentials, or environment files.

## Working features

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

Staff access is granted only to accounts whose email is explicitly listed in `ADMIN_EMAILS`. These emails cannot register through the public form. Provision staff before opening public registration.

In a trusted terminal, set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12–128 characters) and optionally `ADMIN_NAME`, then run:

```sh
npm run admin:create
```

The script uses `DATABASE_PATH` from the shell, or `.data/fablab.sqlite`; it does not automatically load `.env.local`. Use the same database path as the website. Existing accounts are never overwritten. Add the created email to the comma-separated `ADMIN_EMAILS` in the server environment and restart the server. Sign in normally, then open `/admin` or the staff link in the member dashboard. Clear credential environment variables when finished.

For lost passwords, an authorised database operator must reset the account using a fresh scrypt salt/hash and revoke its sessions. Self-service password recovery needs an institutional identity or verified email service, which is not configured here.

## Deployment configuration

- `APP_URL`: exact public origin, e.g. `https://fablab.example.edu`. Write requests enforce matching Origin headers.
- `DATABASE_PATH`: persistent SQLite file, on a local disk mounted to the Node server.
- `ADMIN_EMAILS`: comma-separated provisioned staff addresses.
- `COOKIE_SECURE`: `true` over HTTPS. `false` is only for local HTTP testing; production defaults to secure cookies when omitted.

```sh
npm run build
npm start
```

For standalone hosting, copy `public` and `.next/static` into the standalone bundle before running its server. Use a single application instance with persistent disk. SQLite/WAL files and private uploads must be backed up together using a SQLite-aware backup process. An ephemeral/serverless filesystem will lose submissions. For multiple hosts, migrate storage and uploaded files to managed services.

## Operational limits

The supplied machine inventory, machine states, rates, project examples, impact metrics and images remain sample content. Replace these with verified institutional records before publication. The booking calendar itself reads real saved reservations. Estimates use the external machine rate until staff verify internal-rate eligibility; material charges require a separate quote.

This app uses local password accounts. Email ownership, BUET membership and certifications are not automatically verified. No institutional SSO, payment processing, automatic email or SMS delivery is configured. Public forms really save requests; they do not claim an email was sent. Staff can review requests in `/admin`, and signed-in members can track them in `/dashboard`. Anonymous enquiries remain visible to staff and return a reference to the visitor.

Review institutional contact details, public content, operating hours, data retention, funding/partner descriptions and service policy before launch. Submitted records remain until the operator removes them. Apply deployment-level request throttling and storage quotas appropriate to expected traffic; application routes also enforce payload limits and rate limits.

## Quality checks

```sh
npm run lint
npm run build
npm run typecheck
npm test
npm audit
```

Browser tests use installed Google Chrome in headless mode, start a production server on port 3100, create a fresh `.data/test-*.sqlite` database and provision a test-only staff account. Build first. The tests do not use the normal application database. Screenshots and failure traces are written to `test-results/`.

The suite covers public routes and links, responsive layouts, search/sort, registration, wizard state, uploads, persistence, cancellation, all enquiry types, duplicate-slot races, closed days, maintenance, origin checks, private-file access and staff authorisation. See `BUG_HUNT.md` for the final results and findings.
