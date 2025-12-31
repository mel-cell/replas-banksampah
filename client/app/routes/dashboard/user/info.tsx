import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Smartphone,
  QrCode,
  Recycle,
  Coins,
  Clock,
  CheckCircle,
  AlertCircle,
  Info as InfoIcon,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export function meta() {
  return [
    { title: "Cara Penggunaan - Replas" },
    {
      name: "description",
      content:
        "Panduan lengkap cara menggunakan sistem Replas untuk pengumpulan botol bekas.",
    },
  ];
}

export default function UserInfo() {
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      step: 1,
      title: "Login ke Akun",
      description: "Akses akun Anda untuk memulai.",
      icon: Smartphone,
      color: "text-blue-500",
      bgCode: "bg-blue-500/10",
      details: [
        "Buka aplikasi/web Replas",
        "Masukkan kredensial",
        "Masuk ke Dashboard",
      ],
    },
    {
      step: 2,
      title: "Scan QR Lokasi",
      description: "Temukan mesin terdekat & scan.",
      icon: QrCode,
      color: "text-purple-500",
      bgCode: "bg-purple-500/10",
      details: [
        "Pilih menu Scan QR",
        "Arahkan ke mesin",
        "Tunggu deteksi selesai",
      ],
    },
    {
      step: 3,
      title: "Masukkan Botol",
      description: "Mulai proses daur ulang.",
      icon: Recycle,
      color: "text-green-500",
      bgCode: "bg-green-500/10",
      details: [
        "Pastikan botol bersih",
        "Masukkan satu per satu",
        "Sistem menghitung otomatis",
      ],
    },
    {
      step: 4,
      title: "Klaim Reward",
      description: "Nikmati hasil kontribusi Anda.",
      icon: Coins,
      color: "text-amber-500",
      bgCode: "bg-amber-500/10",
      details: [
        "Poin masuk otomatis",
        "Cek saldo di wallet",
        "Tukar dengan hadiah",
      ],
    },
  ];

  const tips = [
    {
      title: "Persiapan Botol",
      items: [
        "Cuci bersih & keringkan",
        "Lepas tutup & label",
        "Pastikan tidak penyok parah",
      ],
      icon: CheckCircle,
      class: "border-l-4 border-l-green-500",
    },
    {
      title: "Waktu Operasional",
      items: [
        "Mesin aktif 24/7",
        "Cek status online di app",
        "Hindari jam maintenance",
      ],
      icon: Clock,
      class: "border-l-4 border-l-blue-500",
    },
    {
      title: "Penting Diingat",
      items: [
        "Hanya botol plastik PET",
        "Jangan masukkan benda lain",
        "Lapor jika error",
      ],
      icon: AlertCircle,
      class: "border-l-4 border-l-amber-500",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-10 pb-10"
    >
      {/* Hero Header */}
      <motion.div
        variants={item}
        className="relative rounded-3xl overflow-hidden bg-linear-to-br from-emerald-900 via-green-800 to-emerald-950 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Recycle className="w-64 h-64" />
        </div>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 border-0 backdrop-blur-md">
              <InfoIcon className="w-3.5 h-3.5 mr-2" />
              Panduan Pengguna v2.0
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Cara Mudah <span className="text-emerald-400">Kontribusi</span>
              <br />
              untuk Bumi
            </h1>
            <p className="text-lg text-emerald-100/80 leading-relaxed">
              Ikuti 4 langkah sederhana ini untuk mengubah sampah botol plastik
              menjadi poin berharga. Mudah, cepat, dan menguntungkan.
            </p>
          </div>
          {/* Visual abstract elements or CTA if needed */}
        </div>
      </motion.div>

      {/* Steps Grid */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              1-4
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Langkah Daur Ulang
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                whileHover={{ y: -5 }}
                className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${step.bgCode} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-7 h-7 ${step.color}`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="font-black text-gray-200 dark:text-gray-700 absolute top-6 right-6 text-4xl select-none">
                    0{step.step}
                  </span>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 relative z-10">
                  {step.description}
                </p>

                <div className="space-y-3 relative z-10">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full ${step.color.replace("text-", "bg-")}`}
                      ></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div variants={item} className="grid lg:grid-cols-3 gap-6">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card
              key={index}
              className={`overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-900/50 ${tip.class}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tip.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-muted-foreground bg-gray-50 dark:bg-white/5 p-2 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* FAQ Compact */}
      <motion.div variants={item}>
        <Card className="bg-linear-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-none shadow-inner">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                FAQ Center
              </span>
            </div>
            <CardTitle className="text-2xl">
              Pertanyaan Sering Diajukan
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {[
                { q: "Berapa poin per botol?", a: "1 botol = 10 poin reward." },
                {
                  q: "Kapan bisa dicairkan?",
                  a: "Kapan saja, minimum 100 poin.",
                },
              ].map((faq, i) => (
                <div key={i} className="group cursor-pointer">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "Mesin error?",
                  a: "Lapor via menu Contact atau Admin di lokasi.",
                },
                {
                  q: "Durasi sesi scan?",
                  a: "Maksimal 5 menit per sesi aktif.",
                },
              ].map((faq, i) => (
                <div key={i} className="group cursor-pointer">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
