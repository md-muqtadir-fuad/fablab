import { test, expect, type Page } from '@playwright/test';
const origin = 'http://localhost:3100';
const headers = { Origin: origin };
const pdf = (text = 'Notice') => ({ name: 'schedule.pdf', mimeType: 'application/pdf', buffer: Buffer.from(`%PDF-1.4\n${text}\n%%EOF`) });

async function signInAsStaff(page: Page) {
  await page.goto('/login?next=/admin/notices');
  await page.getByLabel('Email', { exact: true }).fill('staff@example.test');
  await page.getByLabel('Password').fill('Test-staff-password-2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Notices', exact: true })).toBeVisible();
}

function dayOffset(days: number) { const d = new Date(); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }

test('staff publish, edit, draft and delete a notice with an attachment', async ({ page, request }) => {
  const title = `Workshop schedule ${crypto.randomUUID().slice(0, 6)}`;
  await signInAsStaff(page);
  await page.getByRole('link', { name: 'New notice' }).click();
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Category').selectOption('Training');
  await page.getByLabel('Notice text').fill('The CNC workshop moves to Room 102.\nBring safety glasses.');
  await page.getByLabel('Pin to the top of the notice board').check();
  await page.locator('input[name="attachment"]').setInputFiles(pdf());
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Notice saved.');
  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  // Public board, detail page and attachment
  await page.goto('/notices');
  await page.getByRole('link', { name: new RegExp(title) }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await expect(page.getByText('Bring safety glasses.')).toBeVisible();
  const fileUrl = await page.getByRole('link', { name: /Download/ }).getAttribute('href');
  expect(fileUrl).toMatch(/^\/files\/notices\//);
  const file = await request.get(fileUrl!);
  expect(file.status()).toBe(200);
  expect(file.headers()['content-type']).toBe('application/pdf');
  const noticeUrl = page.url();

  // Homepage strip and header link
  await expect.poll(async () => { await page.goto('/'); return page.getByRole('region', { name: 'Latest notices' }).getByText(title).count(); }).toBeGreaterThan(0);
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Notices' })).toHaveCount(1);

  // Edit: rename and save as draft → hidden from the public
  await page.goto('/admin/notices');
  await page.getByRole('listitem').filter({ hasText: title }).getByRole('link', { name: 'Edit' }).click();
  await page.getByLabel('Title').fill(`${title} (moved)`);
  await page.getByRole('button', { name: 'Save as draft' }).click();
  await expect(page.getByRole('status')).toHaveText('Changes saved.');
  await expect(page.getByRole('listitem').filter({ hasText: `${title} (moved)` }).getByText('draft', { exact: true })).toBeVisible();
  // Hidden notices show the not-found page (status may be 200 because pages stream).
  const hidden = await (await request.get(noticeUrl)).text();
  expect(hidden).toContain('Page Not Found');
  expect(hidden).not.toContain('Bring safety glasses.');

  // Delete removes the notice and its file
  await page.getByRole('listitem').filter({ hasText: `${title} (moved)` }).getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Delete notice' }).click();
  await page.getByRole('button', { name: 'Yes, delete notice' }).click();
  await expect(page.getByRole('status')).toHaveText('Notice deleted.');
  expect((await request.get(fileUrl!)).status()).toBe(404);
});

test('notice form validation, scheduling and fake files', async ({ page, request }) => {
  await signInAsStaff(page);
  await page.goto('/admin/notices/new');
  await page.getByLabel('Title').fill('Scheduled closure');
  await page.getByLabel('Notice text').fill('Short');
  await page.locator('input[name="attachment"]').setInputFiles({ name: 'fake.pdf', mimeType: 'application/pdf', buffer: Buffer.from('<html>not a pdf</html>') });
  await page.getByLabel('Notice text').evaluate((el) => el.removeAttribute('minlength'));
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByRole('alert').first()).toContainText('Please fix the highlighted fields.');
  await expect(page.getByText('Write the notice in 10–10,000 characters.')).toBeVisible();
  await expect(page.getByText('This file does not look like a real PDF or image.')).toBeVisible();
  await expect(page.getByLabel('Title')).toHaveValue('Scheduled closure');

  await page.getByLabel('Notice text').fill('The lab will be closed for the annual inventory check.');
  await page.getByLabel('Publish date').fill(dayOffset(5));
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Notice saved.');
  await expect(page.getByRole('listitem').filter({ hasText: 'Scheduled closure' }).getByText('scheduled', { exact: true })).toBeVisible();
  expect(await (await request.get('/notices')).text()).not.toContain('Scheduled closure');
});

test('notice admin is protected and stored files cannot escape storage', async ({ request, playwright }) => {
  const anonymous = await request.get('/admin/notices', { maxRedirects: 0 });
  expect([302, 303, 307]).toContain(anonymous.status());
  expect(anonymous.headers()['location']).toContain('/login');
  const member = await playwright.request.newContext({ baseURL: origin });
  expect((await member.post('/api/auth', { headers, data: { mode: 'register', name: 'Notice Member', email: `member-${crypto.randomUUID()}@example.test`, password: 'Correct-horse-battery-2026' } })).status()).toBe(200);
  for (const path of ['/admin/notices', '/admin/notices/new']) { const html = await (await member.get(path)).text(); expect(html, path).not.toContain('name="title"'); expect(html, path).not.toContain('Published notices appear'); expect(html, path).toContain('Page Not Found'); }
  await member.dispose();
  for (const path of ['/files/..%2F.env.local', '/files/notices/..%2F..%2Fpackage.json', '/files/notices/missing.pdf', '/files/notices/script.html']) expect((await request.get(path)).status(), path).toBe(404);
  expect(await (await request.get('/notices/does-not-exist')).text()).toContain('Page Not Found');
  expect((await request.get('/notices?category=Training')).status()).toBe(200);
});

test('staff can preview drafts, and visitors can search the notice board', async ({ page, request }) => {
  const word = `vacancy${crypto.randomUUID().slice(0, 6)}`;
  await signInAsStaff(page);
  await page.goto('/admin/notices/new');
  await page.getByLabel('Title').fill(`Recruitment: FabLab Manager ${word}`);
  await page.getByLabel('Category').selectOption('Recruitment');
  await page.getByLabel('Notice text').fill('Applications are invited for the post of FabLab Manager.');
  await page.getByRole('button', { name: 'Save as draft' }).click();
  await expect(page.getByRole('status')).toHaveText('Notice saved.');

  // Drafts: hidden from visitors and search, but staff get a preview
  await page.getByRole('link', { name: /Drafts/ }).click();
  const row = page.getByRole('listitem').filter({ hasText: word });
  const previewUrl = await row.getByRole('link', { name: 'Preview' }).getAttribute('href');
  expect(await (await request.get(`/notices?q=${word}`)).text()).toContain('No matching notices');
  expect(await (await request.get(previewUrl!)).text()).not.toContain('Applications are invited');
  await page.goto(previewUrl!);
  await expect(page.getByText(/Staff preview\. This is a draft\./)).toBeVisible();

  // Publish it, then find it with search and the Recruitment filter
  await page.getByRole('link', { name: 'Edit notice' }).click();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Changes saved.');
  await page.goto('/notices');
  await page.getByLabel('Search notices').fill(word);
  await page.getByLabel('Search notices').press('Enter');
  await expect(page.getByRole('status')).toContainText(`1 notice matching “${word}”`);
  await page.goto('/notices?category=Recruitment');
  await expect(page.getByRole('link', { name: new RegExp(word) })).toBeVisible();
});
