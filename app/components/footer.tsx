import React, { useContext } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../root"; // Sesuaikan path ini jika perlu

// Define translations for Footer component
const translations = {
  id: {
    footerTagline: "Mengubah sampah menjadi peluang.",
    footerLinks: "Tautan Cepat",
    footerLegal: "Legal",
    privacy: "Kebijakan Privasi",
    terms: "Syarat & Ketentuan",
    footerContact: "Kontak Kami",
    copyright: "© 2025 Replas. Semua hak cipta dilindungi.",
  },
  en: {
    footerTagline: "Turning trash into opportunities.",
    footerLinks: "Quick Links",
    footerLegal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    footerContact: "Contact Us",
    copyright: "© 2025 Replas. All rights reserved.",
  },
};

// Type-safe keys for translations
type StringKey =
  | "footerTagline"
  | "footerLinks"
  | "footerLegal"
  | "privacy"
  | "terms"
  | "footerContact"
  | "copyright";

export default function Footer() {
  const { lang } = useContext(LanguageContext);

  // Type-safe translation function
  const t = (key: StringKey): string => {
    const currentLang = translations[lang] ? lang : "en"; // Fallback to 'en'
    return translations[currentLang] && translations[currentLang][key]
      ? (translations[currentLang][key] as string)
      : key;
  };

  const transactions = {
    id: {
      // Footer
      footerTagline:
        "Recycle To E-Money - Membuat keberlanjutan menguntungkan.",
      footerLinks: "Tautan",
      footerLegal: "Hukum",
      footerContact: "Kontak",
      privacy: "Privasi",
      terms: "Syarat",
      copyright: "© 2024 Replas. Semua hak dilindungi.",
    },
    en: {
      // Footer
      footerTagline: "Recycle To E-Money - Making sustainability profitable.",
      footerLinks: "Links",
      footerLegal: "Legal",
      footerContact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      copyright: "© 2024 Replas. All rights reserved.",
    },
  };

  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo_3.webp"
                alt="Replas Logo"
                className="w-12 h-12 mr-2"
              />
              <h3 className="text-xl font-bold">Replas</h3>
            </div>
            <p className="text-muted-foreground">{t("footerTagline")}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Layanan
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerLegal")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t("terms")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footerContact")}</h4>
            <p className="text-muted-foreground">Email: info@replas.com</p>
            <p className="text-muted-foreground">Phone: +62 123 456 789</p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
