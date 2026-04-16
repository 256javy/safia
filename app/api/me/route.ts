import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createServiceClient } from "@/lib/supabase/server";

// DELETE /api/me — GDPR: delete user and all associated data
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
