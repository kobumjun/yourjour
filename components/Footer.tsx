"use client";

import Link from "next/link";
import { useTranslation } from "./LanguageContext";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-brand">YOURS</span>
          <span className="footer-text">{t("footer.rights")}</span>
        </div>
        <div className="footer-right">
          <Link href="/wholesale" className="footer-link">
            {t("footer.wholesale")}
          </Link>
          <a href="tel:01045563123" className="footer-link">
            {t("footer.call")} 010-4556-3123
          </a>
        </div>
      </div>
    </footer>
  );
}

