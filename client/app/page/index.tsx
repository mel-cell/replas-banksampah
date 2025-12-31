import React, { useContext } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  User,
  MapPin,
  Barcode,
  Recycle,
  DollarSign,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Zap,
  Coins,
  Users,
  Globe,
} from "lucide-react";
import { Link } from "react-router";
import { LanguageContext } from "../root";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer";
import Navbar from "~/components/Navbar";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section - Premium 3D Isometric */}
      <div className="relative w-full overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6 border border-emerald-200 dark:border-emerald-800">
                <Leaf className="w-4 h-4" />
                <span>
                  {t("hero.subtitle") || "Smart Recycling Revolution"}
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
                {t("hero.title")
                  .split(" ")
                  .map((word: string, i: number) =>
                    i < 2 ? (
                      <span
                        key={i}
                        className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500"
                      >
                        {word}{" "}
                      </span>
                    ) : (
                      word + " "
                    )
                  )}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button className="h-14 px-8 rounded-full text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
                  {t("hero.button")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Link
                  to="/about"
                  className="h-14 px-8 rounded-full text-lg flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur-2xl transform rotate-3 scale-95 group-hover:rotate-1 group-hover:scale-100 transition-all duration-700 opacity-70"></div>
              <img
                src="/hero-new.png"
                alt="Smart Recycling City"
                className="relative z-10 w-full rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-transform duration-700 hover:-translate-y-2"
              />

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Recycle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Total Recycled
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    1,240+ Tons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What is Replas? - Modern Cards */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("whatIs.title")}
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              {t("whatIs.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t("whatIs.card1Title"),
                desc: t("whatIs.card1Desc"),
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-100 dark:bg-amber-900/20",
              },
              {
                title: t("whatIs.card2Title"),
                desc: t("whatIs.card2Desc"),
                icon: Leaf,
                color: "text-emerald-500",
                bg: "bg-emerald-100 dark:bg-emerald-900/20",
              },
              {
                title: t("whatIs.card3Title"),
                desc: t("whatIs.card3Desc"),
                icon: DollarSign,
                color: "text-blue-500",
                bg: "bg-blue-100 dark:bg-blue-900/20",
              },
              {
                title: t("whatIs.card4Title"),
                desc: t("whatIs.card4Desc"),
                icon: User,
                color: "text-purple-500",
                bg: "bg-purple-100 dark:bg-purple-900/20",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 dark:bg-gray-800 bg-gray-50 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-white/10"></div>
                <CardHeader className="pb-4 relative z-10">
                  <div
                    className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight Section (Zig-Zag) */}
      <section className="py-24 bg-stone-50 dark:bg-gray-950 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Business Case */}
          <div className="flex flex-col md:flex-row items-center gap-16 mb-32">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
                <img
                  src="/service-scan.png"
                  alt="Business Solution"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="inline-block p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t("useCases.businessTitle")}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t("useCases.businessDesc")}
              </p>
              <ul className="space-y-4 mb-8">
                {[1, 2, 3].map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <span>Smart waste management analytics</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-full px-6">
                {t("hero.button")}
              </Button>
            </div>
          </div>

          {/* Personal Case */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 mb-6">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t("useCases.personalTitle")}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t("useCases.personalDesc")}
              </p>
              <Button variant="outline" className="rounded-full px-6">
                Start Saving Today
              </Button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 bg-linear-to-br from-purple-500 to-indigo-600 p-1">
                <div className="bg-gray-900 rounded-[1.2rem] overflow-hidden relative h-[400px] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[url('/city.webp')] opacity-50 bg-cover bg-center"></div>
                  <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 m-8 transform group-hover:-translate-y-2 transition-transform">
                    <h4 className="text-2xl font-bold text-white mb-2">
                      My Wallet
                    </h4>
                    <p className="text-emerald-400 text-4xl font-mono font-bold">
                      Rp 1.250.000
                    </p>
                    <p className="text-gray-300 mt-2 text-sm">
                      Equivalent to 450 Bottles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Steps with Connecting Line */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("howItWorks.title")}
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t("howItWorks.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-linear-to-r from-emerald-200 via-blue-200 to-emerald-200 dark:from-emerald-800 dark:to-emerald-800 -z-10"></div>

            {[
              {
                title: t("howItWorks.step1Title"),
                desc: t("howItWorks.step1Desc"),
                icon: User,
              },
              {
                title: t("howItWorks.step3Title"),
                desc: t("howItWorks.step3Desc"),
                icon: Barcode,
              }, // Swapped step 2/3 roughly for flow
              {
                title: t("howItWorks.step5Title"),
                desc: t("howItWorks.step5Desc"),
                icon: Recycle,
              },
              {
                title: t("howItWorks.step7Title"),
                desc: t("howItWorks.step7Desc"),
                icon: DollarSign,
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-4 border-emerald-50 dark:border-gray-700 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500 transition-all duration-300 relative z-10">
                  <step.icon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-br from-emerald-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[100px] -top-1/2 -left-1/4"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[80px] -bottom-1/2 -right-1/4"></div>

        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            {t("cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="h-16 px-10 rounded-full text-xl bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-500/25 transition-transform hover:-translate-y-1">
                {t("cta.button")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="h-16 px-10 rounded-full text-xl text-white border-white/20 hover:bg-white/10 transition-transform hover:-translate-y-1 bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
