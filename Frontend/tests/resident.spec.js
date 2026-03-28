const { test, expect } = require('@playwright/test');

// Login helper
async function loginAsResident(page) {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'REPLACE_RESIDENT_EMAIL');
  await page.fill('input[name="password"]', 'REPLACE_RESIDENT_PASSWORD');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
}

test('resident dashboard loads', async ({ page }) => {
  await loginAsResident(page);
  await expect(page).toHaveURL(/dashboard/i);
  await expect(page.locator('h1, h2')).toBeVisible();
});

test('submit request page loads', async ({ page }) => {
  await loginAsResident(page);
  await page.goto('http://localhost:3000/submit-request');
  await expect(page.locator('form')).toBeVisible();
});

test('my requests page loads', async ({ page }) => {
  await loginAsResident(page);
  await page.goto('http://localhost:3000/my-requests');
  await expect(page).toHaveURL(/my-requests/i);
});
