import React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Footer from "../components/footer";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import {
  Scan,
  Smartphone,
  LayoutDashboard,
  QrCode,
  Coins,
  History,
  ArrowRight,
} from "lucide-react";

export function meta() {
  return [
    { title: "Our Services - Replas Ecosystem" },
    {
      name: "description",
      content:
        "Explore the complete Replas ecosystem: Smart Recycling Machines and Digital Dashboard.",
    },
  ];
}

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute inset-0 top-0 left-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
              Smart Services
            </span>{" "}
            for a Green Future
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("services.subtitle") ||
              "Experience the seamless integration of IoT hardware and digital platforms."}
          </p>
        </div>
      </section>

      {/* Intro Quote */}
      <section className="py-20 bg-stone-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 italic max-w-4xl mx-auto">
            "{t("services.intro")}"
          </blockquote>
        </div>
      </section>

      {/* Replas Machine Section */}
      <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] transform rotate-3 scale-95 group-hover:rotate-1 group-hover:scale-100 transition-all duration-700"></div>
              <img
                src="/service-scan.png"
                alt="Smart Scanning"
                className="relative z-10 w-full rounded-[2.5rem] shadow-2xl transform transition-transform duration-700 hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
              />
              <div className="absolute -bottom-6 -right-6 z-20 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                <QrCode className="w-10 h-10 text-emerald-600" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Instant Scan
                  </p>
                  <p className="text-xs text-gray-500">AI Powered Detection</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                <Scan className="w-7 h-7" />
              </div>
              <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                {t("services.replasBankTitle")}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {t("services.replasBankDesc")}
              </p>

              <div className="bg-stone-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                  {t("services.features.title")}
                </h3>
                <ul className="space-y-4">
                  {(
                    t("services.features.list", {
                      returnObjects: true,
                    }) as string[]
                  ).map((feature: string, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Web Features Section */}
      <section className="py-24 bg-stone-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="mb-6 w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                <Smartphone className="w-7 h-7" />
              </div>
              <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                {t("services.webFeaturesTitle")}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {t("services.webFeaturesDesc")}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {(
                  t("services.webFeatures.list", {
                    returnObjects: true,
                  }) as string[]
                ).map((feature: string, i) => (
                  <Card
                    key={i}
                    className="border-none shadow-md bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      {i === 0 && (
                        <History className="w-6 h-6 text-blue-500 shrink-0" />
                      )}
                      {i === 1 && (
                        <Coins className="w-6 h-6 text-amber-500 shrink-0" />
                      )}
                      {i === 2 && (
                        <LayoutDashboard className="w-6 h-6 text-purple-500 shrink-0" />
                      )}
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {feature}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gray-900 p-2">
                {/* Mockup Dashboard Preview */}
                <div className="w-full aspect-video bg-gray-800 rounded-2xl overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-900/50 to-gray-900 flex items-center justify-center">
                    <img
                      src="/city.webp"
                      className="opacity-20 absolute inset-0 w-full h-full object-cover"
                      alt="Dashboard BG"
                    />
                    <div className="text-center z-10">
                      <p className="text-emerald-400 font-mono mb-2">
                        Replas Dashboard v2.0
                      </p>
                      <h3 className="text-white text-3xl font-bold">
                        Real-time Analytics
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-blue-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
