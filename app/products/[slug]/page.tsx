"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserSupabaseClient } from "../../../lib/supabaseClient";
import { useTranslation } from "../../../components/LanguageContext";

type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_text: string | null;
  is_visible: boolean;
  hero_image_url: string | null;
};

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  is_cover: boolean;
  sort_order: number | null;
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase || !slug) return;
    void supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          const productData = data as Product;
          setProduct(productData);
          const { data: imageData } = await supabase
            .from("product_images")
            .select("*")
            .eq("product_id", productData.id)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });
          if (imageData) {
            setImages(imageData as ProductImage[]);
          }
        }
      });
  }, [slug]);

  if (!product) {
    return (
      <div className="page product-detail-page">
        <p className="empty-text">{t("products.loadingOrMissing")}</p>
      </div>
    );
  }

  return (
    <div className="page product-detail-page">
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <div
            className="product-detail-image-inner"
            style={
              product.hero_image_url
                ? { backgroundImage: `url(${product.hero_image_url})` }
                : undefined
            }
          />
          {images.length > 1 && (
            <div className="product-detail-gallery">
              {images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="product-detail-thumb"
                  style={{ backgroundImage: `url(${img.image_url})` }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-body">
          <h1>{product.title}</h1>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">
            {product.price_text || t("home.priceOnRequest")}
          </p>
        </div>
      </div>
    </div>
  );
}

