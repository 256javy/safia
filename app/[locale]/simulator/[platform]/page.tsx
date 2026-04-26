import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLATFORM_IDS } from "@/features/simulator/platforms/registry";
import type { Platform } from "@/stores/accounts-store";
import { PlatformHubClient } from "./client";

type Props = {
  params: Promise<{ platform: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  if (!PLATFORM_IDS.includes(platform as Platform)) return {};
  return {
    title: `Simulador: ${platform} — Safia`,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return PLATFORM_IDS.map((platform) => ({ platform }));
}

export default async function PlatformHubPage({ params }: Props) {
  const { platform } = await params;
  if (!PLATFORM_IDS.includes(platform as Platform)) notFound();
  return <PlatformHubClient platform={platform as Platform} />;
}
