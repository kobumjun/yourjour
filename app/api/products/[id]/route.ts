import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "../../../../lib/supabaseServer";

type RouteParams = {
  params: { id: string };
};

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const body = await req.json();
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  const { uploadedImages, ...productData } = body as {
    uploadedImages?: string[];
    [key: string]: unknown;
  };

  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", Number(params.id))
    .select()
    .single();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 400 }
    );
  }

  const productId = Number(params.id);

  if (Array.isArray(uploadedImages)) {
    await supabase.from("product_images").delete().eq("product_id", productId);
    if (uploadedImages.length > 0) {
      const rows = uploadedImages.map((url, index) => ({
        product_id: productId,
        image_url: url,
        is_cover: index === 0,
        sort_order: index
      }));
      await supabase.from("product_images").insert(rows);
    }
  }

  return NextResponse.json(data ?? null);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", Number(params.id));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

