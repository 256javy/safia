import type { Metadata } from "next";
import { FlowRoute } from "@/features/simulator/FlowRoute";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ platform: string; locale: string }>;
  searchParams: Promise<{ account?: string; via?: string; action?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { platform } = await params;
  const sp = await searchParams;
  return <FlowRoute platform={platform} kind="change-password" accountId={sp.account} via={sp.via} action={sp.action} />;
}
