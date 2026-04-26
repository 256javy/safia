import type { Platform } from "@/stores/accounts-store";

export interface PlatformMeta {
  id: Platform;
  /** i18n key under simulator.platforms.<id> */
  nameKey: string;
  /** Brand color used for badges and accents in the centro de cuentas */
  brandColor: string;
  /** Identity field shown in the account card (email or username) */
  identityField: "email" | "username";
  /** Whether 2FA is mandatory (cannot be disabled) */
  totpMandatory: boolean;
  /** Minimum password length for create flow */
  passwordMinLength: number;
  /** Minimum zxcvbn score for create flow */
  passwordMinStrength: 0 | 1 | 2 | 3 | 4;
}

export const PLATFORMS: Record<Platform, PlatformMeta> = {
  google: {
    id: "google",
    nameKey: "google",
    brandColor: "#4285f4",
    identityField: "email",
    totpMandatory: false,
    passwordMinLength: 8,
    passwordMinStrength: 2,
  },
  instagram: {
    id: "instagram",
    nameKey: "instagram",
    brandColor: "#e1306c",
    identityField: "username",
    totpMandatory: false,
    passwordMinLength: 8,
    passwordMinStrength: 2,
  },
  facebook: {
    id: "facebook",
    nameKey: "facebook",
    brandColor: "#1877f2",
    identityField: "email",
    totpMandatory: false,
    passwordMinLength: 8,
    passwordMinStrength: 2,
  },
  bank: {
    id: "bank",
    nameKey: "bank",
    brandColor: "#0a2540",
    identityField: "email",
    totpMandatory: true,
    passwordMinLength: 12,
    passwordMinStrength: 3,
  },
};

export const PLATFORM_IDS: Platform[] = ["google", "instagram", "facebook", "bank"];
