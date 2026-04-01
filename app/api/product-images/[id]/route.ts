import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "../../../../lib/supabaseServer";

type RouteParams = {
  params: { id: string };
};

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", Number(params.id));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

