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
    console.error("Failed to update product", {
      error: error?.message,
      productId: params.id,
      productData
    });
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 400 }
    );
  }

  const productId = Number(params.id);

  if (Array.isArray(uploadedImages)) {
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);
    if (deleteError) {
      console.error("Failed to delete existing product_images", {
        productId,
        error: deleteError.message
      });
    }
    if (uploadedImages.length > 0) {
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
        console.error("Failed to insert updated product_images rows", {
          productId,
          error: imageInsertError.message
        });
      } else {
        console.log("Updated product_images rows", {
          productId,
          count: rows.length
        });
      }
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

