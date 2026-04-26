import type { Platform } from "@/stores/accounts-store";
import type {
  ChangePasswordVia,
  FlowSpec,
  PlatformChrome,
  PlatformDefinition,
  TotpAction,
} from "./types";

export interface PlatformBuilders {
  id: Platform;
  chrome: PlatformChrome;
  create: () => FlowSpec;
  login: () => FlowSpec;
  changePassword: (via: ChangePasswordVia) => FlowSpec;
  recover: (redirectAfter: (accountId: string) => string) => FlowSpec;
  totp: (action: TotpAction) => FlowSpec;
}

export function definePlatform(b: PlatformBuilders): PlatformDefinition {
  return {
    chrome: b.chrome,
    buildFlow: (kind, opts) => {
      switch (kind) {
        case "create":
          return b.create();
        case "login":
          return b.login();
        case "change-password":
          return b.changePassword(opts.via ?? "auth");
        case "recover":
          return b.recover((id) => `/simulator/${b.id}/change-password?account=${id}&via=forgot`);
        case "totp":
          return b.totp(opts.action ?? "enable");
      }
    },
  };
}
