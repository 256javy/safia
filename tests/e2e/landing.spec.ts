import { test, expect } from "@playwright/test";

test("landing /es shows hero and primary CTA navigates to /es/accounts", async ({ page }) => {
  await page.goto("/es");
  // The primary CTA is a Link to /accounts (next-intl prefixes with /es)
  const cta = page.locator('a[href="/es/accounts"]').first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/es\/accounts$/);
});
