"use client";

import Image from "next/image";
import { useTranslation } from "../components/LanguageContext";
import Link from "next/link";

export default function HomePage() {
  const { t } = useTranslation();

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
          {getShowcaseCards().map((card) => (
            <article key={card.title} className="preview-card">
              <div className="preview-image">
                <div
                  className="preview-image-inner"
                  style={{ backgroundImage: `url(${card.imageUrl})` }}
                />
              </div>
              <div className="preview-body">
                <h3 className="preview-title">{card.title}</h3>
                <p className="preview-subtitle">{card.subtitle}</p>
                <p className="preview-price">{t("home.priceOnRequest")}</p>
                <Link
                  href="/products"
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

function getShowcaseCards() {
  return [
    {
      title: "Silk Light Necklace",
      subtitle: "Fine champagne gold line with softened glow.",
      imageUrl: "/assets/home/showcase-1.png"
    },
    {
      title: "Aurora Ring Set",
      subtitle: "Stackable rings for quiet, daily luxury.",
      imageUrl: "/assets/home/showcase-2.png"
    },
    {
      title: "Lumière Bracelet",
      subtitle: "Minimal bracelet with soft reflected light.",
      imageUrl: "/assets/home/showcase-3.png"
    }
  ];
}

