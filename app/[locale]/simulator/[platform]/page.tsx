import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLATFORMS } from "@/features/simulator/platforms";
import { SimulatorClient } from "./client";

type Props = {
  params: Promise<{ platform: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  if (!(platform in PLATFORMS)) return {};
  return {
    title: `Simulator: ${platform} — Safia`,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return Object.keys(PLATFORMS).map((platform) => ({ platform }));
}

export default async function SimulatorPage({ params }: Props) {
  const { platform } = await params;
  if (!(platform in PLATFORMS)) notFound();
  return <SimulatorClient platform={platform} />;
}
