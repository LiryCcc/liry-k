import { expect, test } from '@playwright/test';

const SSR_ROUTES = [
  { heading: 'Streaming SSR counter', path: '/' },
  { heading: 'About this project', path: '/about' },
  { heading: 'Appearance settings', path: '/settings' }
] as const;

for (const route of SSR_ROUTES) {
  test(`renders ${route.path} without client JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto(route.path);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
    await context.close();
  });
}

test('navigates between pages without another document request', async ({ page }) => {
  const documentRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'document') {
      documentRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL('/about');
  await expect(page.getByRole('heading', { level: 1, name: 'About this project' })).toBeVisible();

  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page).toHaveURL('/settings');
  await expect(page.getByRole('heading', { level: 1, name: 'Appearance settings' })).toBeVisible();
  expect(documentRequests).toHaveLength(1);
});

test('hydrates and updates the counter', async ({ page }) => {
  await page.goto('/');
  const output = page.locator('output');

  await expect(output).toHaveText('0');
  await page.getByRole('button', { name: 'Increase counter' }).click();
  await expect(output).toHaveText('1');
  await page.getByRole('button', { name: 'Decrease counter' }).click();
  await expect(output).toHaveText('0');
});

test('switches between system, light, and dark themes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/settings');
  const root = page.locator('html');
  const systemButton = page.getByRole('button', { name: 'Follow system' });

  await expect(systemButton).toHaveAttribute('aria-pressed', 'true');
  await expect(root).toHaveCSS('color-scheme', 'dark');

  await page.getByRole('button', { name: 'Light' }).click();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(root).toHaveCSS('color-scheme', 'light');

  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(root).toHaveCSS('color-scheme', 'dark');

  await systemButton.click();
  expect(await root.getAttribute('data-theme')).toBeNull();
  await expect(root).toHaveCSS('color-scheme', 'dark');
});

test('returns a real 404 response for an unknown route', async ({ page }) => {
  const response = await page.goto('/missing');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
});
