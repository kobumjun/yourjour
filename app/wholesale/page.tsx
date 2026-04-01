"use client";

import { useTranslation } from "../../components/LanguageContext";

export default function WholesalePage() {
  const { t } = useTranslation();

  return (
    <div className="page wholesale-page">
      <header className="page-header">
        <h1>{t("wholesale.title")}</h1>
        <p>{t("wholesale.subtitle")}</p>
      </header>

      <section className="wholesale-panel">
        <h2>{t("wholesale.contactTitle")}</h2>
        <p>{t("wholesale.contactText")}</p>
        <div className="wholesale-actions-main">
          <a href="tel:01045563123" className="btn-primary">
            {t("wholesale.callNow")}
          </a>
        </div>
        <div className="wholesale-email">
          <h3>{t("wholesale.emailHeading")}</h3>
          <div className="wholesale-email-placeholder">
            <span>{t("wholesale.emailPlaceholder")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

