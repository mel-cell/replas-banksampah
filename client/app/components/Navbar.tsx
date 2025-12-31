import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Sun, Moon, Menu, X, Globe, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { ThemeContext, LanguageContext } from "../root";

export default function Navbar() {
  const { i18n } = useTranslation();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { lang, setLang } = useContext(LanguageContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLang = (newLang: "id" | "en") => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { path: "/", label: i18n.t("nav.home") || "Home" },
    { path: "/about", label: i18n.t("nav.about") || "About" },
    { path: "/services", label: i18n.t("nav.services") || "Services" },
    { path: "/contact", label: i18n.t("nav.contact") || "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const isDarkHeropage = ["/contact"].includes(location.pathname);
  const textColorClass =
    !scrolled && isDarkHeropage && !isMobileMenuOpen
      ? "text-white"
      : "text-gray-600 dark:text-gray-300";
  const logoTextClass =
    !scrolled && isDarkHeropage && !isMobileMenuOpen
      ? "text-white"
      : "text-gray-900 dark:text-white";
  const buttonGhostClass =
    !scrolled && isDarkHeropage && !isMobileMenuOpen
      ? "text-white hover:bg-white/20 hover:text-white"
      : "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMobileMenuOpen
            ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800 py-2"
            : "bg-transparent border-b border-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="/logo_3.webp"
                  alt="Replas Logo"
                  className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <span
                  className={`text-xl font-bold tracking-tight transition-colors duration-300 ${logoTextClass}`}
                >
                  Replas
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div
                className={`flex items-center space-x-1 p-1 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
                    : ""
                }`}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                      isActive(link.path)
                        ? "text-emerald-600 bg-white dark:bg-gray-700 shadow-sm"
                        : `${textColorClass} hover:text-emerald-500 hover:bg-white/10`
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Auth and Controls */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative group">
                <button
                  className={`p-2 rounded-full hover:bg-white/10 transition-colors ${textColorClass}`}
                >
                  <Globe className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <button
                    onClick={() => changeLang("en")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${lang === "en" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLang("id")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${lang === "id" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                  >
                    Indonesia
                  </button>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${textColorClass}`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div
                className={`h-6 w-px mx-1 ${!scrolled && isDarkHeropage ? "bg-white/30" : "bg-gray-200 dark:bg-gray-700"}`}
              ></div>

              <Link to="/login">
                <Button
                  variant="ghost"
                  className={`rounded-full font-medium ${buttonGhostClass}`}
                >
                  {i18n.t("nav.login") || "Login"}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 px-6 border-none">
                  {i18n.t("nav.register") || "Get Started"}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${textColorClass}`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${textColorClass}`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 py-6 space-y-6">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Language
                </span>
                <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => changeLang("en")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${lang === "en" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400" : "text-gray-500"}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLang("id")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${lang === "id" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400" : "text-gray-500"}`}
                  >
                    ID
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-center h-12 rounded-xl"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-center h-12 rounded-xl shadow-lg">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
