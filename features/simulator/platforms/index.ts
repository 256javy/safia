import type { Platform } from "@/stores/accounts-store";
import type { PlatformDefinition } from "@/features/simulator/engine/types";
import { googlePlatform } from "./google";
import { instagramPlatform } from "./instagram";
import { facebookPlatform } from "./facebook";
import { bankPlatform } from "./bank";

const REGISTRY: Partial<Record<Platform, PlatformDefinition>> = {
  google: googlePlatform,
  instagram: instagramPlatform,
  facebook: facebookPlatform,
  bank: bankPlatform,
};

export function getPlatform(id: Platform): PlatformDefinition | null {
  return REGISTRY[id] ?? null;
}

export function registerPlatform(id: Platform, def: PlatformDefinition): void {
  REGISTRY[id] = def;
}
