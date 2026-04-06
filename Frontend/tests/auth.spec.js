const { test, expect } = require('@playwright/test');

test('login page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('login with wrong password shows error', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'wrong@email.com');
  await page.fill('input[name="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  // Should stay on login page
  await expect(page).toHaveURL(/login/i);
});

test('admin login redirects to dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'REPLACE_ADMIN_EMAIL');
  await page.fill('input[name="password"]', 'REPLACE_ADMIN_PASSWORD');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/dashboard/i);
});

test('resident login redirects to dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'REPLACE_RESIDENT_EMAIL');
  await page.fill('input[name="password"]', 'REPLACE_RESIDENT_PASSWORD');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/dashboard/i);
});

test('logout works', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'REPLACE_ADMIN_EMAIL');
  await page.fill('input[name="password"]', 'REPLACE_ADMIN_PASSWORD');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  // Click logout
  await page.click('button:has-text("Logout")');
  await page.waitForTimeout(2000);
  await expect(page).toHaveURL(/login/i);
});
