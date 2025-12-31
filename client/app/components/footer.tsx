import React, { useContext } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../root";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

// Define translations for Footer component
const translations = {
  id: {
    footerTagline:
      "Mengubah sampah menjadi peluang digital untuk masa depan yang lebih hijau.",
    footerLinks: "Tautan Cepat",
    footerLegal: "Legal & Privasi",
    privacy: "Kebijakan Privasi",
    terms: "Syarat & Ketentuan",
    footerContact: "Hubungi Kami",
    newsletterTitle: "Berlangganan Newsletter",
    newsletterDesc:
      "Dapatkan update terbaru tentang fitur dan tips daur ulang.",
    copyright: "© 2025 Replas. Semua hak cipta dilindungi.",
  },
  en: {
    footerTagline:
      "Turning waste into digital opportunities for a greener future.",
    footerLinks: "Quick Links",
    footerLegal: "Legal & Privacy",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    footerContact: "Contact Us",
    newsletterTitle: "Subscribe to Newsletter",
    newsletterDesc: "Get the latest updates on features and recycling tips.",
    copyright: "© 2025 Replas. All rights reserved.",
  },
};

type StringKey = keyof typeof translations.en;

export default function Footer() {
  const { lang } = useContext(LanguageContext);

  const t = (key: StringKey): string => {
    const currentLang = translations[lang] ? lang : "en";
    // @ts-ignore
    return translations[currentLang][key] || key;
  };

  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-black dark:text-gray-400 relative overflow-hidden font-sans border-t border-gray-800">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo_3.webp"
                alt="Replas Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                Replas
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {t("footerTagline")}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 tracking-wide">
              {t("footerLinks")}
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Services", to: "/services" },
                { label: "Contact", to: "/contact" },
                { label: "Dashboard", to: "/login" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 opacity-0 group-hover:opacity-100 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 tracking-wide">
              {t("footerContact")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                <span className="text-gray-400 leading-tight">
                  SMKN 6 Malang, Jl. Ki Ageng Gribig No. 28, Malang
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">info@replas.id</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 tracking-wide">
              {t("newsletterTitle")}
            </h4>
            <p className="text-gray-400 mb-4 text-sm">{t("newsletterDesc")}</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-full placeholder:text-gray-600"
              />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-900/20">
                Subscribe <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{t("copyright")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              {t("privacy")}
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
