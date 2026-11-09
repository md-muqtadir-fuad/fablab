# Changelog

What changed in the website, newest first. Add a short entry here with every pull request
(what changed, why, and anything the next person must do). Code-level detail lives in git:
`git log` for history, the pull request for the full diff.

## 2026-11-09 — Notice board and admin foundation (Zaid)

Branch: `feat/zaid`

### Added
- **Notice board** at `/notices` with category filters (General, Training, Event, Recruitment,
  Closure, Urgent), search, 10 notices per page, pinned notices, and notice pages at
  `/notices/<id>` with PDF or image attachments.
- **Latest notices** strip on the homepage (3 newest), plus "Notices" in the header menu and footer.
- **Staff notice admin** at `/admin/notices`: create, edit, save as draft, schedule a future
  publish date, set a last day to show, attach a file (PDF/JPG/PNG/WebP, max 4 MB), delete.
- **Staff notice list** with status tabs (Published, Scheduled, Drafts, Expired) with counts, and search.
- **Staff preview**: staff can open drafts, scheduled and expired notices to check them before
  visitors can; a blue banner marks the preview. Visitors still get "not found".
- **Admin panel layout** for `/admin` with a side menu (Bookings & requests, Notices), the signed-in
  person's initials and role; compact on phones.
- **Staff roles** on accounts: `admin` (everything) and `editor` (content only).
- **`npm run db:setup`**: creates/updates tables, creates the first admin, adds 4 sample notices.
- **`ENABLE_ADMIN` switch**: the notice board only appears when `ENABLE_ADMIN=true`.
- **File storage** helper: local `storage/` folder by default, Vercel Blob when
  `BLOB_READ_WRITE_TOKEN` is set. Files are served from `/files/...`.
- **Bangla fonts** (Noto Sans Bengali, Noto Serif Bengali) served from the site itself, so Bangla text
  looks the same on every device. They only download on pages that contain Bangla.
- **Sitemap** now lists every public notice and refreshes hourly.
- **Automatic checks on GitHub** (`.github/workflows/ci.yml`): every pull request runs lint, type check,
  build and all browser tests, and shows a green tick or red cross before merging.
- Browser tests for the notice board (`tests/notices.spec.ts`).

### Changed
- **Database library**: `better-sqlite3` replaced by `@libsql/client`. Same SQLite file
  (`.data/fablab.sqlite`), but it can also use a Turso database by setting `DATABASE_URL`
  and `DATABASE_AUTH_TOKEN`. Removes the Visual Studio / node-gyp install error on Windows.
- Database tables are now created through numbered migrations (`lib/server/migrations.mjs`)
  instead of on every start.
- Signing in is required before any `/admin` page loads (checked in `middleware.ts`).
- `scripts/create-admin.cjs` now just runs `db-setup.mjs`; `npm run admin:create` still works.
- `.env.example` and `README.md` describe the new settings and setup steps.
- If a session expires while editing a notice, the form keeps the text and asks to sign in again
  instead of showing an error page. A failed save no longer leaves an unused uploaded file behind.

### Not changed
- Bookings, requests, uploads, login and all public pages work as before (all existing tests pass).
- With `ENABLE_ADMIN` unset (as on Vercel now), the live site looks exactly the same.

### To do after merging
- Delete the 4 sample notices before launch (they say "Sample notice for testing").
- Vercel: leave `ENABLE_ADMIN` unset until Turso and Blob are set up (plan step 3).
- Known, older issues: header shows "Sign in" while signed in; not-found pages return
  status 200 instead of 404 because of the site-wide loading screen.
