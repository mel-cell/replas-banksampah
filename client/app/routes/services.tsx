import React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
// Komponen Button tidak lagi digunakan, jadi bisa dihapus jika tidak ada CTA
// import { Button } from "../components/ui/button";
import Footer from "../components/footer";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

export function meta() {
  return [
    { title: "How to Use - Replas" },
    {
      name: "description",
      content: "Learn how to use the Replas smart machine and web dashboard.",
    },
  ];
}

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 bg-[#D8EEE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-foreground mb-6">
            {t("services.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t("services.intro")}
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
                {t("services.replasBankTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("services.replasBankDesc")}
              </p>
              <h3 className="text-2xl font-bold mb-4">
                {t("services.features.title")}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                {(
                  t("services.features.list", {
                    returnObjects: true,
                  }) as string[]
                ).map((feature: string) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <img
                src="/hero.webp"
                alt="Replas Bank machine"
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
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
                {t("services.webFeaturesTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("services.webFeaturesDesc")}
              </p>
              <h3 className="text-2xl font-bold mb-4">
                {t("services.webFeatures.title")}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                {(
                  t("services.webFeatures.list", {
                    returnObjects: true,
                  }) as string[]
                ).map((feature: string) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-2 lg:order-1">
              <img
                src="/hero.webp"
                alt="Web dashboard"
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
