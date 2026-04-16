import { NextResponse } from "next/server";
import { getManifest } from "@/lib/content/loader";

// GET /api/modules — list available modules (ISR)
export const revalidate = 3600;

export async function GET() {
  const manifest = getManifest();
  return NextResponse.json({ modules: manifest.modules });
}
