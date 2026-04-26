import type { Metadata } from "next";
import { StubFlow } from "@/features/simulator/StubFlow";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <StubFlow flow="login" />;
}
