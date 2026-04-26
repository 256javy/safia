import type { Metadata } from "next";
import { redirect } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function SimulatorIndex({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/accounts", locale });
}
