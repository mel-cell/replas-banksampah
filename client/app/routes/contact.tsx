import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import Footer from "../components/footer";
import Navbar from "~/components/Navbar";

export function meta() {
  return [
    { title: "Contact Us - Replas Support" },
    {
      name: "description",
      content:
        "Get in touch with Replas team for support, partnerships, and inquiries.",
    },
  ];
}

export default function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <Navbar />

      {/* Background Pattern for the whole page */}
      <div className="absolute inset-0 top-[400px] z-0 opacity-40 mix-blend-multiply dark:mix-blend-normal pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute left-0 bottom-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Hero Section - UPDATED: Emerald Gradient instead of Black */}
      <section className="relative pt-32 pb-48 lg:pt-40 lg:pb-64 overflow-hidden">
        {/* Main Hero Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900"></div>

        {/* Background Image with better blending */}
        <div className="absolute inset-0 bg-[url('/hero-new.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>

        {/* Soft Overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-stone-50/90 dark:to-gray-950/90"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in-up">
            <MessageSquare className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content Area - Overlapping Card */}
      <section className="relative z-20 -mt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
            <div className="grid lg:grid-cols-5 min-h-[700px]">
              {/* Contact Information (Left - 2/5 width) */}
              <div className="lg:col-span-2 p-10 md:p-14 bg-linear-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden flex flex-col justify-between">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 mix-blend-soft-light"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 mix-blend-overlay"></div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">
                    {t("contact.contactInfoTitle")}
                  </h2>
                  <p className="text-emerald-50 text-sm mb-12 opacity-90">
                    Find us at these locations or reach out directly.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {t("contact.addressTitle")}
                        </h3>
                        <p className="text-emerald-50 leading-relaxed text-sm opacity-90">
                          {t("contact.address")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {t("contact.phoneTitle")}
                        </h3>
                        <p className="text-emerald-50 text-sm opacity-90">
                          {t("contact.phone")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {t("contact.emailTitle")}
                        </h3>
                        <p className="text-emerald-50 text-sm opacity-90">
                          {t("contact.email")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {t("contact.hoursTitle")}
                        </h3>
                        <p className="text-emerald-50 whitespace-pre-line text-sm opacity-90">
                          {t("contact.hours")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                  <div className="flex gap-4">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-emerald-600 transition-all duration-300"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form (Right - 3/5 width) */}
              <div className="lg:col-span-3 p-10 md:p-14 bg-white dark:bg-gray-900">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    {t("contact.contactFormTitle")}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-10">
                    Have a question or feedback? Fill out the form below and
                    we'll get back to you shortly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                          {t("contact.nameLabel")}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                          {t("contact.emailLabel")}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                        {t("contact.subjectLabel")}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                        {t("contact.messageLabel")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 resize-none hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        placeholder="Your message here..."
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full md:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/30 text-base font-medium transition-all hover:-translate-y-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {t("contact.sendButton")}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid - Clean Cards */}
      <section className="py-20 bg-transparent relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("locationsTitle")}
            </h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-500/50 hover:shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">
                  SMKN 6 Malang
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-2xl">
                  {t("location1") ||
                    "Jl. Ki Ageng Gribig No.28, Madyopuro, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139"}
                </p>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0">
                <a
                  href="https://maps.app.goo.gl/example"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                >
                  View Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
