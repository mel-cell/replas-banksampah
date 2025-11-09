import React, { useState, useContext } from "react";
import { Link } from "react-router";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { ThemeContext, LanguageContext } from "../root";

export default function Navbar() {
  const { i18n } = useTranslation();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { lang, setLang } = useContext(LanguageContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLang = (newLang: "id" | "en") => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo_3.webp"
                  alt="Replas Logo"
                  className="w-20 h-20 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />
                <span className="ml-2 text-lg sm:text-xl font-bold text-primary hidden sm:block">Replas</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {i18n.t('nav.home')}
                </Link>
                <Link
                  to="/about"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {i18n.t('nav.about')}
                </Link>
                <Link
                  to="/services"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {i18n.t('nav.services')}
                </Link>
                <Link
                  to="/contact"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {i18n.t('nav.contact')}
                </Link>
              </div>
            </div>

            {/* Desktop Auth and Controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => changeLang(e.target.value as "id" | "en")}
                className="text-foreground bg-background border border-border rounded px-2 py-1 text-sm"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
              </select>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded hover:bg-accent transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
              <Link to="/login">
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  {i18n.t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  {i18n.t('nav.register')}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground hover:text-primary p-2 rounded"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-40">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {i18n.t('nav.home')}
                </Link>
                <Link
                  to="/about"
                  className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {i18n.t('nav.about')}
                </Link>
                <Link
                  to="/services"
                  className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {i18n.t('nav.services')}
                </Link>
                <Link
                  to="/contact"
                  className="block text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {i18n.t('nav.contact')}
                </Link>
              </div>

              {/* Mobile Auth and Controls */}
              <div className="space-y-2 pt-2 border-t border-border">
                {/* Language Selector */}
                <select
                  value={lang}
                  onChange={(e) => {
                    changeLang(e.target.value as "id" | "en");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-foreground bg-background border border-border rounded px-3 py-2 text-sm"
                >
                  <option value="id">ID</option>
                  <option value="en">EN</option>
                </select>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center p-3 rounded hover:bg-accent transition-colors"
                >
                  <span className="mr-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  {isDark ? (
                    <Sun className="w-5 h-5 text-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground" />
                  )}
                </button>

                <Link
                  to="/login"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 justify-center">
                    {i18n.t('nav.login')}
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white justify-center">
                    {i18n.t('nav.register')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="pt-16"></div>
    </>
  );
}
