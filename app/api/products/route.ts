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

  const { uploadedImages, ...productData } = body as {
    uploadedImages?: string[];
    [key: string]: unknown;
  };

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();
  if (error || !data) {
    console.error("Failed to insert product", {
      error: error?.message,
      productData
    });
    return NextResponse.json(
      { error: error?.message ?? "Insert failed" },
      { status: 400 }
    );
  }

  const productId = data.id as number;

  if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
    const rows = uploadedImages.map((url, index) => ({
      product_id: productId,
      image_url: url,
      is_cover: index === 0,
      sort_order: index
    }));
    const { error: imageInsertError } = await supabase
      .from("product_images")
      .insert(rows);
    if (imageInsertError) {
      console.error("Failed to insert product_images rows", {
        productId,
        error: imageInsertError.message
      });
    } else {
      console.log("Inserted product_images rows", { productId, count: rows.length });
    }
  }

  return NextResponse.json(data ?? null, { status: 201 });
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

