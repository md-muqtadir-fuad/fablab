# Bug hunt results

Completed 15 September 2026.

## Fixed

- Homepage equipment cards linked to nonexistent IDs.
- Forms only showed a success message and lost submissions on refresh.
- The booking wizard used hard-coded dates, project details, prices, and certification claims.
- Duplicate reservations could target the same machine session.
- Maintenance machines could be booked.
- File uploads were decorative and had no size, type, ownership, or download checks.
- Member login, dashboards, cancellation, and staff review were missing.
- Catalogue sorting was decorative; project search was missing.
- Invalid dynamic URLs could render a missing-page screen with HTTP 200.
- Remote placeholder images delayed first rendering and could leave blank panels.
- The mobile menu lacked complete keyboard state and Escape handling.
- The site had fake metrics, a fake testimonial, prototype labels, awkward copy, mojibake, and inconsistent capitalization.
- Footer partner logos were above the useful links and the original red was too bright.
- Dependencies included a critical Next.js advisory and four high-severity advisories.

## Verification

- Production build: passed, 53 routes generated.
- ESLint: passed with no warnings.
- TypeScript: passed.
- Dependency audit: zero known production vulnerabilities.
- Browser/API suite: six full workflows passed; the one failing invalid-URL assertion led to the final 404 fix.
- Final 404 regression check: invalid equipment booking URL returns HTTP 404.

The browser suite covers public links, responsive layouts, search and sorting, registration, booking persistence, uploads, cancellation, every enquiry type, duplicate-slot races, closed days, machine maintenance, request-origin checks, private-file access, and staff authorization.

## Deployment checks still owned by BUET

Replace sample machine, project, rate, status, and impact records with approved institutional data. Configure persistent storage, the public `APP_URL`, staff accounts, backups, and HTTPS. Institutional SSO, verified email delivery, payment processing, and automatic certification lookup require external BUET services and credentials.
