import { test, expect } from "@playwright/test";

const PLATFORMS = ["google", "instagram", "facebook", "bank"] as const;

for (const platform of PLATFORMS) {
  test(`simulator/${platform}/create — TrainingBanner present, robots noindex`, async ({ page }) => {
    await page.goto(`/es/simulator/${platform}/create`);
    await page.waitForLoadState("networkidle");

    // robots meta
    const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(robots ?? "").toMatch(/noindex/);

    // TrainingBanner visible (role=alert from component) — wait for client hydration.
    const banner = page.locator('[role="alert"]').first();
    await expect(banner).toBeVisible({ timeout: 15000 });

    // Tamper: remove the banner from DOM and confirm the integrity tick mutates document.title.
    // The interval inside TrainingBanner ticks every 2s.
    await page.evaluate(() => {
      const el = document.querySelector('[role="alert"]');
      if (el?.parentNode) el.parentNode.removeChild(el);
    });
    // Title flips to a localized tamper warning. /es uses "SIMULACIÓN".
    await page.waitForFunction(
      () => /(SIMULACI[ÓO]N|TRAINING|SIMULAÇÃO)/i.test(document.title),
      null,
      { timeout: 6000 },
    );
    expect(await page.title()).toMatch(/(SIMULACI[ÓO]N|TRAINING|SIMULAÇÃO)/i);
  });
}
