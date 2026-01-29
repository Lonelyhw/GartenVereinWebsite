import { expect, test } from '@playwright/test';

test('Startseite zeigt Aktuelles', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Aktuelles' })).toBeVisible();
});

test('News-Detailseite laedt nach Klick', async ({ page }) => {
  await page.goto('/');
  const readMore = page.getByRole('link', { name: 'Weiterlesen' }).first();
  await expect(readMore).toBeVisible();
  await readMore.click();
  await expect(page).toHaveURL(/\/news\/\d+$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('Suche findet Vereinshaus', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.getByPlaceholder('Suche').first();
  await searchInput.fill('Vereinshaus');
  await expect(
    page.getByTestId('search-results').getByRole('link', { name: /Vereinshaus/i })
  ).toBeVisible();
});
