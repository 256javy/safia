import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safia — Academia de Seguridad",
  description:
    "Plataforma open-source de educación en seguridad para usuarios no técnicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
