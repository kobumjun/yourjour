import "./globals.css";
import type { ReactNode } from "react";
import { LanguageProvider } from "../components/LanguageContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const metadata = {
  title: "YOURS – Jewelry Wholesale & Collection",
  description: "Luxury jewelry wholesale and product catalog for YOURS."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="site-root">
            <Header />
            <main className="site-main">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

