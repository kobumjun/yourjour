"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "./LanguageContext";

export function Header() {
  const pathname = usePathname();
  const { t, lang, setLang } = useTranslation();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          YOURS
        </Link>
        <nav className="nav">
          <Link
            href="/"
            className={pathname === "/" ? "nav-link active" : "nav-link"}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/products"
            className={
              pathname?.startsWith("/products")
                ? "nav-link active"
                : "nav-link"
            }
          >
            {t("nav.products")}
          </Link>
          <Link
            href="/wholesale"
            className={
              pathname?.startsWith("/wholesale")
                ? "nav-link active"
                : "nav-link"
            }
          >
            {t("nav.wholesale")}
          </Link>
        </nav>
        <div className="header-right">
          <a href="tel:01045563123" className="phone-link">
            010-4556-3123
          </a>
          <select
            className="language-select"
            value={lang}
            onChange={(e) =>
              setLang(e.target.value as "ko" | "en" | "es" | "pt")
            }
          >
            <option value="ko">한국어</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="pt">PT</option>
          </select>
        </div>
      </div>
    </header>
  );
}

