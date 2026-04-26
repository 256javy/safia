import { test, expect } from "@playwright/test";

test("bank create flow with TOTP — generates code, verifies, persists with totp.enabled", async ({ page }) => {
  await page.addInitScript(() => {
    try { window.localStorage.clear(); } catch {}
  });

  await page.goto("/es/simulator/bank/create");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Documento de identidad").waitFor({ state: "visible", timeout: 15000 }).catch(async () => {
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  // Screen 1: nationalId
  await page.getByLabel("Documento de identidad").fill("ABC123456");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Screen 2: name
  await page.getByLabel("Nombre", { exact: true }).fill("Ada");
  await page.getByLabel("Apellido", { exact: true }).fill("Lovelace");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Screen 3: email
  await page.getByLabel("Correo electrónico").fill("ada.bank.e2e@example.com");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Screen 4: phone
  await page.getByLabel("Teléfono móvil").fill("+14155552671");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Screen 5: password (bank: minLength 12, minStrength 3)
  const passphrase = "correct-purple-elephant-bicycle-7421-zebra";
  await page.getByLabel("Contraseña", { exact: true }).fill(passphrase);
  await page.getByLabel("Confirma la contraseña").fill(passphrase);
  await page.getByRole("button", { name: "Continuar" }).click();

  // Screen 6: totpScan — read the secret from the rendered formatted text
  const secretText = await page.locator("text=/[A-Z2-7]{4} [A-Z2-7]{4} [A-Z2-7]{4} [A-Z2-7]{4}/").first().textContent();
  expect(secretText).toBeTruthy();
  const secret = secretText!.replace(/\s+/g, "");
  expect(secret).toMatch(/^[A-Z2-7]{32}$/);

  await page.getByRole("button", { name: "Continuar" }).click();

  // Screen 7: totpVerify — generate the current TOTP code from secret using otpauth
  const code = await page.evaluate(async (s) => {
    // Use otpauth from the running app's bundle path is not exposed; do it manually with WebCrypto.
    // Implement TOTP RFC 6238 (SHA1, 6 digits, 30s)
    const base32Decode = (b32: string): Uint8Array => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = "";
      for (const c of b32) {
        const v = alphabet.indexOf(c);
        if (v < 0) continue;
        bits += v.toString(2).padStart(5, "0");
      }
      const bytes = new Uint8Array(Math.floor(bits.length / 8));
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
      }
      return bytes;
    };
    const counter = Math.floor(Date.now() / 1000 / 30);
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setUint32(0, Math.floor(counter / 0x100000000));
    view.setUint32(4, counter & 0xffffffff);
    const key = await crypto.subtle.importKey(
      "raw",
      base32Decode(s).buffer as ArrayBuffer,
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"],
    );
    const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, buf));
    const offset = sig[sig.length - 1] & 0xf;
    const bin = ((sig[offset] & 0x7f) << 24)
      | ((sig[offset + 1] & 0xff) << 16)
      | ((sig[offset + 2] & 0xff) << 8)
      | (sig[offset + 3] & 0xff);
    return String(bin % 1_000_000).padStart(6, "0");
  }, secret);

  await page.getByLabel("Código del autenticador").fill(code);
  await page.getByRole("button", { name: "Activar" }).click();

  await expect(page).toHaveURL(/\/es\/accounts/, { timeout: 10_000 });

  const stored = await page.evaluate(() => window.localStorage.getItem("safia.accounts.v1"));
  expect(stored).toContain("ada.bank.e2e@example.com");
  expect(stored).toContain('"enabled":true');
});
