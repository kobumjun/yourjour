"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "../../lib/supabaseClient";
import { useTranslation } from "../../components/LanguageContext";

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

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [imagesByProduct, setImagesByProduct] = useState<
    Record<number, ProductImage[]>
  >({});

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    void (async () => {
      const [{ data: productData }, { data: imageData }] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("product_images")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true })
      ]);
      if (productData) {
        setProducts(productData as Product[]);
      }
      if (imageData) {
        const grouped: Record<number, ProductImage[]> = {};
        (imageData as ProductImage[]).forEach((img) => {
          if (!grouped[img.product_id]) grouped[img.product_id] = [];
          grouped[img.product_id].push(img);
        });
        setImagesByProduct(grouped);
      }
    })();
  }, []);

  return (
    <div className="page products-page">
      <header className="page-header">
        <h1>{t("products.title")}</h1>
        <p>{t("products.subtitle")}</p>
      </header>
      <section className="product-grid">
        {products.length === 0 && (
          <p className="empty-text">{t("products.empty")}</p>
        )}
        {products.map((p) => (
          <article key={p.id} className="product-card">
            <div className="product-image">
              <div
                className="product-image-inner"
                style={getProductImageStyle(p, imagesByProduct[p.id])}
              />
            </div>
            <div className="product-body">
              <h2 className="product-title">{p.title}</h2>
              <p className="product-description">{p.description}</p>
              <p className="product-price">
                {p.price_text || t("home.priceOnRequest")}
              </p>
              {p.slug && (
                <Link
                  href={`/products/${p.slug}`}
                  className="btn-outline small"
                >
                  {t("products.viewDetail")}
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function getProductImageStyle(
  product: Product,
  imgs?: ProductImage[]
): React.CSSProperties | undefined {
  const cover =
    imgs?.find((img) => img.is_cover) ?? (imgs && imgs[0]) ?? null;
  const url = cover?.image_url ?? product.hero_image_url ?? null;
  return url ? { backgroundImage: `url(${url})` } : undefined;
}

