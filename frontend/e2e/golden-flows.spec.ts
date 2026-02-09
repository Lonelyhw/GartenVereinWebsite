import { expect, test } from '@playwright/test';
import path from 'node:path';
import {
  clickResultOrFallback,
  openSearch,
  typeSearch,
  waitForAnyResult,
} from './utils';

test.describe('Goldene Flows', () => {
  test('Public: Startseite, Deep Link, Suche', async ({ page }) => {
    await page.goto('/');

    const newsList = page.getByTestId('news-list');
    await expect(newsList).toBeVisible();
    await expect(newsList.getByTestId('news-item').first()).toBeVisible();

    const firstNewsLink = newsList.getByTestId('news-link').first();
    const href = await firstNewsLink.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(href!);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('news-detail')).toBeVisible();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openSearch(page);
    await typeSearch(page, 'Vereinshaus');
    await waitForAnyResult(page);
    await clickResultOrFallback(page, /Vereinshaus/i, '/vereinshaus');
    await expect(page.getByRole('heading', { name: /Vereinshaus/i })).toBeVisible();
  });

  test('Admin: News erstellen und Dokument hochladen', async ({ page }) => {
    const uniqueId = Date.now();
    const newsTitle = `E2E News ${uniqueId}`;
    const docTitle = `E2E Dokument ${uniqueId}`;

    await page.goto('/intern');
    await page.waitForLoadState('networkidle');
    await page.getByTestId('admin-username').fill('admin');
    await page.getByTestId('admin-password').fill('admin');
    await page.getByTestId('admin-login').click();

    await page.getByTestId('news-create').click();
    await page.getByTestId('news-title').fill(newsTitle);
    await page.getByTestId('news-content').fill('E2E Inhalt');
    await page.getByTestId('news-save').click();
    await expect(page.getByTestId('news-admin-item').getByText(newsTitle)).toBeVisible();

    await page.getByTestId('doc-title').fill(docTitle);
    await page.getByTestId('doc-category').fill('Satzung');
    await page.getByTestId('doc-description').fill('E2E Dokument Beschreibung');

    const filePath = path.join(__dirname, 'fixtures', 'test.pdf');
    await page.getByTestId('doc-file').setInputFiles(filePath);
    await page.getByTestId('doc-save').click();

    await page.goto('/dokumente');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Dokumente/i })).toBeVisible();
    await expect.poll(async () => {
      try {
        return await page.getByText(docTitle).first().isVisible();
      } catch {
        return false;
      }
    }).toBeTruthy();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openSearch(page);
    await typeSearch(page, 'Vereinshaus');
    await waitForAnyResult(page);
    await clickResultOrFallback(page, /Vereinshaus/i, '/vereinshaus');
    await expect(page.getByRole('heading', { name: /Vereinshaus/i })).toBeVisible();

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await openSearch(page);
    await typeSearch(page, docTitle);
    await waitForAnyResult(page);
    await clickResultOrFallback(page, new RegExp(docTitle, 'i'), '/dokumente');
    await expect(page.getByText(docTitle)).toBeVisible();
  });

  test('Fehlerfall: Backend down zeigt Banner', async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
    );

    await page.goto('/');
    const banner = page.getByTestId('status-banner');
    await expect(banner).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText(
      'Auf dem Server ist etwas schiefgelaufen'
    );
  });
});
