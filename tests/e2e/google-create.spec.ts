import { test, expect } from "@playwright/test";

test("google create flow walks 6 screens and persists an account", async ({ page }) => {
  // Reset persisted state in localStorage before navigating
  await page.addInitScript(() => {
    try { window.localStorage.clear(); } catch {}
  });

  await page.goto("/es/simulator/google/create");
  // Next 16 + Turbopack dev mode sometimes hits a stale chunk on first nav; one reload fixes it.
  await page.waitForLoadState("networkidle");

  // Screen 1: name — wait for client hydration before interacting.
  await page.getByLabel("Nombre", { exact: true }).waitFor({ state: "visible", timeout: 15000 }).catch(async () => {
    await page.reload();
    await page.waitForLoadState("networkidle");
  });
  await page.getByLabel("Nombre", { exact: true }).fill("Ada");
  await page.getByLabel("Apellido (opcional)").fill("Lovelace");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Screen 2: birthday
  await page.getByLabel("Fecha de nacimiento").fill("1990-01-01");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Screen 3: email — type a char to trigger the auto-suggest, then overwrite.
  const emailInput = page.getByLabel("Correo electrónico", { exact: true });
  await emailInput.pressSequentially("a");
  await emailInput.fill("ada.lovelace.e2e@example.com");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Screen 4: password
  const passphrase = "correct-purple-elephant-bicycle-7421-zebra";
  await page.getByLabel("Contraseña", { exact: true }).fill(passphrase);
  await page.getByLabel("Confirma la contraseña").fill(passphrase);
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Screen 5: phone (optional)
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Screen 6: review → "Crear cuenta"
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(page).toHaveURL(/\/es\/accounts/, { timeout: 10_000 });
  await expect(page.getByText("ada.lovelace.e2e@example.com")).toBeVisible();
});
