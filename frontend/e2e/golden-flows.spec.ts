import { expect, test } from '@playwright/test';
import path from 'node:path';

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
    await expect(page.getByTestId('news-detail')).toBeVisible();

    await page.goto('/');
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Vereinshaus');
    const searchResults = page.getByTestId('search-results');
    await expect(searchResults).toBeVisible();
    await expect(searchResults.getByText('Vereinshaus')).toBeVisible();
  });

  test('Admin: News erstellen und Dokument hochladen', async ({ page }) => {
    const uniqueId = Date.now();
    const newsTitle = `E2E News ${uniqueId}`;
    const docTitle = `E2E Dokument ${uniqueId}`;

    await page.goto('/intern');
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
    const docList = page.getByTestId('documents-list');
    await expect(docList).toBeVisible();
    await expect(docList.getByTestId('document-item').getByText(docTitle)).toBeVisible();

    await page.goto('/');
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Vereinshaus');
    const searchResults = page.getByTestId('search-results');
    await expect(searchResults.getByText('Vereinshaus')).toBeVisible();
    await searchInput.fill(docTitle);
    await expect(searchResults.getByText(docTitle)).toBeVisible();
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
