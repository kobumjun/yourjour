import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "../../../../lib/supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json(
      { error: "No files provided" },
      { status: 400 }
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Server upload failed", { filePath, error: uploadError });
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("product_images").getPublicUrl(filePath);

    urls.push(publicUrl);
  }

  console.log("Server uploaded product images", { count: urls.length });

  return NextResponse.json({ urls });
}

