import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { createServiceClient } from "@/lib/supabase/server";
import type { ModuleProgress } from "@/types/progress";

function mergeProgress(
  clientProgress: Record<string, ModuleProgress>,
  serverProgress: Record<string, ModuleProgress>,
): Record<string, ModuleProgress> {
  const allModules = new Set([
    ...Object.keys(clientProgress),
    ...Object.keys(serverProgress),
  ]);
  const merged: Record<string, ModuleProgress> = {};

  for (const slug of allModules) {
    const local = clientProgress[slug];
    const server = serverProgress[slug];

    if (!local) { merged[slug] = server; continue; }
    if (!server) { merged[slug] = local; continue; }

    const completedLessons = [
      ...new Set([...local.completed_lessons, ...server.completed_lessons]),
    ];

    const allLessons = new Set([
      ...Object.keys(local.quiz_scores),
      ...Object.keys(server.quiz_scores),
    ]);
    const quizScores: Record<string, number> = {};
    for (const lesson of allLessons) {
      quizScores[lesson] = Math.max(
        local.quiz_scores[lesson] ?? 0,
        server.quiz_scores[lesson] ?? 0,
      );
    }

    merged[slug] = {
      completed_lessons: completedLessons,
      quiz_scores: quizScores,
      started_at: local.started_at < server.started_at ? local.started_at : server.started_at,
      completed_at: local.completed_at ?? server.completed_at,
    };
  }

  return merged;
}

// GET /api/progress — fetch user's completion state
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("users")
    .select("progress_json")
    .eq("id", session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

const progressSchema = z.record(z.string(), z.unknown());

// POST /api/progress — sync completion (merge algorithm per spec §3.4)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: current } = await supabase
    .from("users")
    .select("progress_json")
    .eq("id", session.user.id)
    .single();

  const serverProgress = (current?.progress_json ?? {}) as Record<string, ModuleProgress>;
  const clientProgress = parsed.data as Record<string, ModuleProgress>;

  const merged = mergeProgress(clientProgress, serverProgress);

  const { data, error } = await supabase
    .from("users")
    .update({ progress_json: merged })
    .eq("id", session.user.id)
    .select("progress_json")
    .single();

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}
