import { describe, expect, it, vi } from "vitest";
import { definePlatform } from "@/features/simulator/engine/definePlatform";
import type { FlowSpec } from "@/features/simulator/engine/types";

const stubFlow = (kind: FlowSpec["kind"], extra: Partial<FlowSpec> = {}): FlowSpec => ({
  kind,
  platform: "google",
  screens: [
    { id: "s1", title: "t", cta: { primary: "c" }, next: () => "done" },
  ],
  onComplete: async () => {},
  ...extra,
});

describe("definePlatform", () => {
  it("dispatches kind to the matching builder", () => {
    const create = vi.fn(() => stubFlow("create"));
    const login = vi.fn(() => stubFlow("login"));
    const changePassword = vi.fn(() => stubFlow("change-password"));
    const recover = vi.fn(() => stubFlow("recover"));
    const totp = vi.fn(() => stubFlow("totp"));

    const def = definePlatform({
      id: "google",
      chrome: () => null,
      create,
      login,
      changePassword,
      recover,
      totp,
    });

    def.buildFlow("create", {});
    def.buildFlow("login", {});
    def.buildFlow("change-password", { via: "auth" });
    def.buildFlow("recover", {});
    def.buildFlow("totp", { action: "enable" });

    expect(create).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledTimes(1);
    expect(changePassword).toHaveBeenCalledWith("auth");
    expect(recover).toHaveBeenCalledTimes(1);
    expect(totp).toHaveBeenCalledWith("enable");
  });

  it("change-password defaults via to 'auth' when omitted", () => {
    const changePassword = vi.fn(() => stubFlow("change-password"));
    const def = definePlatform({
      id: "google",
      chrome: () => null,
      create: () => stubFlow("create"),
      login: () => stubFlow("login"),
      changePassword,
      recover: () => stubFlow("recover"),
      totp: () => stubFlow("totp"),
    });
    def.buildFlow("change-password", {});
    expect(changePassword).toHaveBeenCalledWith("auth");
  });

  it("recover passes a redirectAfter that points to change-password?via=forgot", () => {
    let captured: ((id: string) => string) | null = null;
    const def = definePlatform({
      id: "google",
      chrome: () => null,
      create: () => stubFlow("create"),
      login: () => stubFlow("login"),
      changePassword: () => stubFlow("change-password"),
      recover: (redirectAfter) => {
        captured = redirectAfter;
        return stubFlow("recover");
      },
      totp: () => stubFlow("totp"),
    });
    def.buildFlow("recover", {});
    expect(captured).not.toBeNull();
    const url = captured!("acc-123");
    expect(url).toBe("/simulator/google/change-password?account=acc-123&via=forgot");
  });

  it("totp defaults action to 'enable' when omitted", () => {
    const totp = vi.fn(() => stubFlow("totp"));
    const def = definePlatform({
      id: "google",
      chrome: () => null,
      create: () => stubFlow("create"),
      login: () => stubFlow("login"),
      changePassword: () => stubFlow("change-password"),
      recover: () => stubFlow("recover"),
      totp,
    });
    def.buildFlow("totp", {});
    expect(totp).toHaveBeenCalledWith("enable");
  });
});
