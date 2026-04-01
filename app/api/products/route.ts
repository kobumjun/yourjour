import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "../../../lib/supabaseServer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase.from("products").insert(body).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data[0] ?? null, { status: 201 });
}

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data ?? []);
}

