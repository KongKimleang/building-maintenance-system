const { test, expect } = require('@playwright/test');

// Login helper
async function loginAsAdmin(page) {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'REPLACE_ADMIN_EMAIL');
  await page.fill('input[name="password"]', 'REPLACE_ADMIN_PASSWORD');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
}

test('admin dashboard loads', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page).toHaveURL(/dashboard/i);
  await expect(page.locator('h1, h2')).toBeVisible();
});

test('all requests page loads', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('http://localhost:3000/admin/requests');
  await expect(page).toHaveURL(/requests/i);
});

test('user management page loads', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('http://localhost:3000/admin/users');
  await expect(page).toHaveURL(/users/i);
});
