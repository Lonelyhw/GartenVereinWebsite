import { expect, test } from '@playwright/test';
import {
  clickResultOrFallback,
  openSearch,
  typeSearch,
  waitForAnyResult,
} from './utils';

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
  await page.waitForLoadState('networkidle');

  await openSearch(page);
  await typeSearch(page, 'Vereinshaus');
  await waitForAnyResult(page);
  await clickResultOrFallback(page, /Vereinshaus/i, '/vereinshaus');

  await expect(page.getByRole('heading', { name: /Vereinshaus/i })).toBeVisible();
});
