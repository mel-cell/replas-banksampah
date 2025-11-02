import React, { useContext } from "react";
import { cn } from "../lib/utils";
import { LanguageContext } from "../root";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
// Komponen Button tidak lagi digunakan, jadi bisa dihapus jika tidak ada CTA
// import { Button } from "../components/ui/button";
import Footer from "../components/footer";

// Define translations for Services page
const translations = {
  id: {
    title: "Panduan Penggunaan",
    subtitle: "Panduan langkah demi langkah menggunakan mesin dan platform web Replas.",
    intro: "Replas menawarkan alat inovatif dan platform web terintegrasi untuk memudahkan proses daur ulang. Halaman ini menjelaskan cara menggunakan mesin Replas Bank dan fitur platform web kami secara mendetail.",
    replasBankTitle: "Replas Bank - Mesin Daur Ulang Pintar",
    replasBankDesc: "Mesin inovatif kami yang memungkinkan pengguna untuk login dengan barcode ke ruangan tertentu di web, memasukkan botol plastik, dan mengkonversinya menjadi poin secara otomatis.",
    features: {
      title: "Fitur Utama & Cara Pakai",
      list: [
        "Login dengan barcode: Pindai barcode akun untuk masuk ke ruangan tertentu di web.",
        "Penyetoran botol: Masukkan botol plastik ke dalam mesin.",
        "Konversi poin: Botol secara otomatis dikonversi menjadi poin e-money.",
        "Antarmuka touchscreen: Layar yang ramah pengguna untuk memandu proses.",
        "Sistem keamanan: Autentikasi untuk keamanan akun Anda.",
        "Konektivitas IoT: Mesin terhubung untuk monitoring real-time."
      ]
    },
    webFeaturesTitle: "Fitur Platform Web Replas",
    webFeaturesDesc: "Platform web kami menyediakan akun digital untuk menampung poin yang telah dikonversi dari mesin. Tidak lebih dari itu.",
    webFeatures: {
      title: "Fitur Web",
      list: [
        "Akun digital: Wadah untuk menyimpan poin yang dikonversi dari mesin.",
        "Riwayat poin: Lacak poin yang telah dikumpulkan.",
        "Pengaturan akun: Kelola informasi akun dasar."
      ]
    },
  },
  en: {
    title: "How to Use Replas",
    subtitle: "A step-by-step guide to using the Replas machine and web platform.",
    intro: "Replas offers innovative tools and an integrated web platform to make recycling easy. This page explains how to use our Replas Bank machine and web platform features in detail.",
    replasBankTitle: "Replas Bank - Smart Recycling Machine",
    replasBankDesc: "Our innovative machine allows users to login with barcode to a specific room on the web, insert plastic bottles, and automatically convert them into points.",
    features: {
      title: "Key Features & How-To",
      list: [
        "Login with barcode: Scan account barcode to enter a specific room on the web.",
        "Bottle deposit: Insert plastic bottles into the machine.",
        "Point conversion: Bottles are automatically converted into e-money points.",
        "Touchscreen interface: User-friendly screen to guide the process.",
        "Security system: Authentication for account security.",
        "IoT connectivity: Machine connected for real-time monitoring."
      ]
    },
    webFeaturesTitle: "Replas Web Platform Features",
    webFeaturesDesc: "Our web platform provides a digital account to store points converted from the machine. Nothing more than that.",
    webFeatures: {
      title: "Web Features",
      list: [
        "Digital account: Container to store points converted from the machine.",
        "Point history: Track collected points.",
        "Account settings: Manage basic account information."
      ]
    },
  }
};

export function meta() {
  return [
    { title: "How to Use - Replas" },
    { name: "description", content: "Learn how to use the Replas smart machine and web dashboard." },
  ];
}

export default function Services() {
  const { lang } = useContext(LanguageContext);

  type StringKey = 'title' | 'subtitle' | 'intro' | 'replasBankTitle' | 'replasBankDesc' | 'webFeaturesTitle' | 'webFeaturesDesc';

  // Type-safe translation function for string keys
  const t = (key: StringKey): string => {
    const currentLang = translations[lang] ? lang : 'en'; // Fallback to 'en' if lang is invalid
    return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] as string : key;
  };

  // Helper function for nested translations
  const getNested = (key: string): any => {
    const keys = key.split('.');
    const currentLang = translations[lang] ? lang : 'en'; // Fallback to 'en' if lang is invalid
    let value: any = translations[currentLang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value !== undefined ? value : key; // Return key if value is undefined
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-[#D8EEE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-foreground mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t('intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Replas Bank (How to use the machine) */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6 text-green-600">
                {t('replasBankTitle')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('replasBankDesc')}
              </p>
              <h3 className="text-2xl font-bold mb-4">{getNested('features.title')}</h3>
              <ul className="space-y-3 text-muted-foreground">
                {getNested('features.list').map((feature: string) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <img src="/hero.webp" alt="Replas Bank machine" className="w-full max-w-lg mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Web Features (How to use the website) */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-extrabold mb-6 text-green-600">
                {t('webFeaturesTitle')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('webFeaturesDesc')}
              </p>
              <h3 className="text-2xl font-bold mb-4">{getNested('webFeatures.title')}</h3>
              <ul className="space-y-3 text-muted-foreground">
                {getNested('webFeatures.list').map((feature: string) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-2 lg:order-1">
              <img src="/hero.webp" alt="Web dashboard" className="w-full max-w-sm mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
