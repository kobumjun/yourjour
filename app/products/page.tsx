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

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    void supabase
      .from("products")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setProducts(data as Product[]);
        }
      });
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
                style={
                  p.hero_image_url
                    ? { backgroundImage: `url(${p.hero_image_url})` }
                    : undefined
                }
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

