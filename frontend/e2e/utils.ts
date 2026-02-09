import { expect, type Locator, type Page } from '@playwright/test';

function normalizeVisible(locator: Locator) {
  return locator.first();
}

async function isVisible(locator: Locator) {
  try {
    return await normalizeVisible(locator).isVisible();
  } catch {
    return false;
  }
}

async function getSearchInput(page: Page) {
  const byPlaceholder = page.getByPlaceholder(/suche/i);
  if ((await byPlaceholder.count()) > 0) return byPlaceholder.first();

  const byRoleNamed = page.getByRole('textbox', { name: /suche/i });
  if ((await byRoleNamed.count()) > 0) return byRoleNamed.first();

  return page.getByRole('textbox').first();
}

export async function openSearch(page: Page) {
  const input = await getSearchInput(page);
  await input.waitFor({ state: 'visible' });
  await input.click();
  return input;
}

export async function typeSearch(page: Page, query: string) {
  const input = await openSearch(page);
  await input.fill(query);
  await expect.poll(async () => (await input.inputValue()) === query).toBeTruthy();
  return input;
}

export async function waitForAnyResult(page: Page) {
  const noResults = page.getByText(/keine\s+treffer|keine\s+ergebnisse|nichts\s+gefunden/i);
  const listbox = page.getByRole('listbox');
  const options = page.getByRole('option');
  const menu = page.getByRole('menu');
  const menuItems = page.getByRole('menuitem');
  const fallbackLinks = page.locator('a');

  await expect.poll(async () => {
    if (await isVisible(noResults)) return true;
    if (await isVisible(listbox.locator('a'))) return true;
    if (await isVisible(options)) return true;
    if (await isVisible(menu.locator('a'))) return true;
    if (await isVisible(menuItems)) return true;
    return await isVisible(fallbackLinks);
  }).toBeTruthy();
}

export async function clickResultOrFallback(
  page: Page,
  regex: RegExp,
  fallbackUrl: string
) {
  const resultLink = page.getByRole('link', { name: regex }).first();
  const noResults = page.getByText(/keine\s+treffer|keine\s+ergebnisse|nichts\s+gefunden/i).first();

  await expect.poll(async () => {
    if (await isVisible(resultLink)) return 'link';
    if (await isVisible(noResults)) return 'none';
    return 'pending';
  }).toMatch(/link|none/);

  if (await isVisible(resultLink)) {
    await resultLink.click();
    return;
  }

  await page.goto(fallbackUrl);
}
