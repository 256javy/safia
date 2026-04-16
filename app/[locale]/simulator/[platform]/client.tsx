"use client";

import { useTranslations } from "next-intl";
import { SimulatorShell } from "@/features/simulator/SimulatorShell";
import { PLATFORMS } from "@/features/simulator/platforms";

export function SimulatorClient({ platform }: { platform: string }) {
  const t = useTranslations("simulator.platforms");
  const config = PLATFORMS[platform];
  if (!config) return null;

  return (
    <SimulatorShell
      platform={platform}
      platformLabel={t(platform)}
      steps={config.steps}
      renderChrome={config.renderChrome}
    />
  );
}
