import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer";
import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { Users, Globe, Target, Award, Rocket, CheckCircle } from "lucide-react";

export function meta() {
  return [
    { title: "About Us - Replas Vision" },
    {
      name: "description",
      content:
        "Learn more about Replas and our mission to revolutionize recycling.",
    },
  ];
}

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-stone-100 dark:bg-gray-900">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
            Our Story & Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
            Redefining{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              Recycling
            </span>{" "}
            for a <br className="hidden md:block" /> Better Tomorrow.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            {t("about.subtitle") ||
              "We bridge the gap between technology and environmental sustainability."}
          </p>
        </div>
      </section>

      {/* Main Vision Image & Content */}
      <section className="py-12 bg-stone-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
            <img
              src="/about-team.png"
              alt="Replas Team Vision"
              className="w-full object-cover max-h-[600px] transform hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-16">
              <div className="max-w-3xl text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("about.intro")}
                </h2>
                <p className="text-lg text-gray-200 opacity-90">
                  {t("about.missionDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="group">
              <div className="mb-6 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 transform group-hover:rotate-12 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-blue-600 transition-colors">
                {t("about.missionTitle")}
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("about.missionDesc")}
              </p>
            </div>
            <div className="group">
              <div className="mb-6 w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 transform group-hover:rotate-12 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-emerald-600 transition-colors">
                {t("about.visionTitle")}
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("about.visionDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-stone-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("about.teamTitle")}
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-16">
            {t("about.teamDesc")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Tech Innovators",
                icon: Rocket,
                color: "text-purple-500",
                bg: "bg-purple-100 dark:bg-purple-900/20",
                desc: "Building the backbone of smart recycling with cutting-edge IoT and Blockchain.",
              },
              {
                title: "Eco Guardians",
                icon: Users,
                color: "text-green-500",
                bg: "bg-green-100 dark:bg-green-900/20",
                desc: "Ensuring environmental compliance and driving sustainable community initiatives.",
              },
              {
                title: "Business Strategists",
                icon: Award,
                color: "text-amber-500",
                bg: "bg-amber-100 dark:bg-amber-900/20",
                desc: "Forging partnerships that amplify our impact across cities and nations.",
              },
            ].map((team, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-800"
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full ${team.bg} ${team.color} flex items-center justify-center mb-6`}
                >
                  <team.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {team.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {team.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/city.webp"
                alt="Impact"
                className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/50 to-transparent text-white">
                <p className="font-bold text-lg">Jakarta Smart City Project</p>
                <p className="text-sm opacity-80">Pilot Program 2024</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                {t("about.impactTitle")}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {t("about.impactDesc")}
              </p>
              <ul className="space-y-6">
                {[
                  "Reducing 500+ tons of plastic waste monthly",
                  "Empowering 10,000+ active users with extra income",
                  "Supporting 50+ schools and local communities",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-default"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[3rem] p-12 md:p-24 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">
              Start Your Green Journey?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto relative z-10">
              Join thousands of others making a real difference today.
            </p>

            <Link to="/register">
              <Button className="h-16 px-12 bg-white text-emerald-600 hover:bg-gray-100 rounded-full text-xl font-bold shadow-xl transition-transform hover:-translate-y-1 relative z-10">
                Join Replas Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
