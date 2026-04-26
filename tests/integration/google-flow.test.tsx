import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FlowRunner } from "@/features/simulator/engine/FlowRunner";
import { googlePlatform } from "@/features/simulator/platforms/google";
import { useAccountsStore } from "@/stores/accounts-store";

beforeEach(() => {
  useAccountsStore.getState().reset();
  localStorage.clear();
});

const fillField = (label: string, value: string) => {
  const input = screen.getByLabelText(label) as HTMLInputElement | HTMLSelectElement;
  fireEvent.change(input, { target: { value } });
};

describe("Google create flow (integration)", () => {
  it("walks all 6 screens, stores hashed account, no plaintext", async () => {
    const flow = googlePlatform.buildFlow("create", {});
    render(<FlowRunner flow={flow} chrome={googlePlatform.chrome} />);

    // Screen 1: name
    fillField("fields.firstName.label", "Ada");
    fillField("fields.lastName.label", "Lovelace");
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));

    // Screen 2: birthday
    await waitFor(() => screen.getByLabelText("fields.birthdate.label"));
    fillField("fields.birthdate.label", "1990-01-01");
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));

    // Screen 3: email — suggestion may have populated; clear then set unique
    await waitFor(() => screen.getByLabelText("fields.email.label"));
    fillField("fields.email.label", "ada.lovelace@example.com");
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));

    // Screen 4: password
    await waitFor(() => screen.getByLabelText("fields.password.label"));
    const passphrase = "correct-purple-elephant-bicycle-7421-zebra";
    fillField("fields.password.label", passphrase);
    fillField("fields.passwordConfirm.label", passphrase);
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));

    // Screen 5: phone (optional → skip secondary)
    await waitFor(() => screen.getByLabelText("fields.phone.label"));
    fireEvent.click(screen.getByRole("button", { name: "cta.next" }));

    // Screen 6: review
    await waitFor(() => screen.getByRole("button", { name: "cta.create" }));
    fireEvent.click(screen.getByRole("button", { name: "cta.create" }));

    await waitFor(() => {
      const accounts = useAccountsStore.getState().accounts;
      expect(accounts).toHaveLength(1);
      expect(accounts[0].platform).toBe("google");
      expect(accounts[0].password.hash).toMatch(/^[0-9a-f]{64}$/);
    });

    const raw = localStorage.getItem("safia.accounts.v1") ?? "";
    expect(raw).not.toContain(passphrase);
    expect(raw).not.toContain("passwordPlaintext");
  });
});
