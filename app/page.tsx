"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createBrowserSupabaseClient } from "../lib/supabaseClient";
import { useTranslation } from "../components/LanguageContext";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_text: string | null;
  is_visible: boolean;
  hero_image_url: string | null;
};

export default function HomePage() {
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
      .order("created_at", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) {
          setProducts(data as Product[]);
        }
      });
  }, []);

  const filledProducts: Product[] =
    products.length >= 3
      ? products.slice(0, 3)
      : [
          ...products,
          ...getCuratedFallbackProducts().slice(
            0,
            Math.max(0, 3 - products.length)
          )
        ].slice(0, 3);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">YOURS</h1>
          <p className="hero-subtitle">{t("home.heroSubtitle")}</p>
          <div className="hero-actions">
            <Link href="/products" className="btn-primary">
              {t("home.viewCollection")}
            </Link>
            <Link href="/wholesale" className="btn-outline">
              {t("home.wholesaleInquiry")}
            </Link>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-mask">
            <Image
              src="/assets/home/hero-model.png"
              alt="YOURS jewelry model"
              width={260}
              height={340}
              className="hero-image-media"
              priority
            />
          </div>
        </div>
      </section>

      <section className="preview-row" aria-label={t("home.previewRowLabel")}>
        <div className="preview-row-inner">
          {filledProducts.map((p) => (
            <article key={p.id ?? p.slug} className="preview-card">
              <div className="preview-image">
                <div
                  className="preview-image-inner"
                  style={
                    p.hero_image_url
                      ? { backgroundImage: `url(${p.hero_image_url})` }
                      : undefined
                  }
                />
              </div>
              <div className="preview-body">
                <h3 className="preview-title">{p.title}</h3>
                <p className="preview-subtitle">
                  {p.description || t("home.defaultProductSubtitle")}
                </p>
                <p className="preview-price">
                  {p.price_text || t("home.priceOnRequest")}
                </p>
                <Link
                  href={`/products${p.slug ? `/${p.slug}` : ""}`}
                  className="preview-button"
                >
                  {t("products.viewDetail")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="accessories">
        <div className="accessories-layout">
          <Image
            src="/assets/home/ring-left.png"
            alt="YOURS ring accent"
            width={140}
            height={170}
            className="accessories-deco accessories-deco-left"
          />
          <div className="accessories-inner">
            <h2>{t("home.accessoriesTitle")}</h2>
            <p>{t("home.accessoriesBody")}</p>
            <ul className="accessories-bullets">
              <li>{t("home.accessoriesBullet1")}</li>
              <li>{t("home.accessoriesBullet2")}</li>
              <li>{t("home.accessoriesBullet3")}</li>
            </ul>
            <Link href="/products" className="btn-primary">
              {t("home.accessoriesCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="wholesale-global">
        <div className="wholesale-layout">
          <div className="wholesale-inner-alt">
            <h2>{t("home.globalTitle")}</h2>
            <p className="wholesale-body">{t("home.globalBody")}</p>
            <ul className="wholesale-bullets">
              <li>Concept stores & department stores</li>
              <li>Soft gold tones for minimal displays</li>
              <li>Flexible MOQ for new markets</li>
            </ul>
            <div className="wholesale-actions">
              <a href="tel:01045563123" className="btn-primary">
                {t("wholesale.callNow")}
              </a>
              <Link href="/wholesale" className="btn-outline">
                {t("home.globalCta")}
              </Link>
            </div>
          </div>
          <Image
            src="/assets/home/ring-right.png"
            alt="YOURS ring accent"
            width={150}
            height={180}
            className="wholesale-deco wholesale-deco-right"
          />
        </div>
      </section>

      <section className="footer-grid-section">
        <div className="footer-grid-block">
          <div className="footer-grid-image" />
        </div>
      </section>
    </div>
  );
}

function getCuratedFallbackProducts(): Product[] {
  return [
    {
      id: -1,
      title: "Silk Light Necklace",
      slug: "",
      description: "Fine champagne gold line with softened glow.",
      price_text: "Price on Request",
      is_visible: true,
      hero_image_url:
        "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: -2,
      title: "Aurora Ring Set",
      slug: "",
      description: "Stackable rings for quiet, daily luxury.",
      price_text: "Price on Request",
      is_visible: true,
      hero_image_url:
        "https://images.pexels.com/photos/1158438/pexels-photo-1158438.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: -3,
      title: "Lumière Bracelet",
      slug: "",
      description: "Minimal bracelet with soft reflected light.",
      price_text: "Price on Request",
      is_visible: true,
      hero_image_url:
        "https://images.pexels.com/photos/1038710/pexels-photo-1038710.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];
}

