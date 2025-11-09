import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Smartphone,
  QrCode,
  Recycle,
  Coins,
  Clock,
  CheckCircle,
  AlertCircle,
  Info as InfoIcon
} from "lucide-react";

export function meta() {
  return [
    { title: "Cara Penggunaan - Replas" },
    { name: "description", content: "Panduan lengkap cara menggunakan sistem Replas untuk pengumpulan botol bekas." },
  ];
}

export default function UserInfo() {
  const { t } = useTranslation();

  const steps = [
    {
      step: 1,
      title: "Login ke Akun",
      description: "Masuk ke akun Anda menggunakan email dan password yang sudah terdaftar.",
      icon: Smartphone,
      details: [
        "Buka aplikasi atau website Replas",
        "Klik menu Login",
        "Masukkan email dan password",
        "Klik tombol Login"
      ]
    },
    {
      step: 2,
      title: "Cari Lokasi Bank Sampah",
      description: "Temukan lokasi bank sampah terdekat yang memiliki mesin pengumpul botol.",
      icon: QrCode,
      details: [
        "Buka menu Scan QR di dashboard",
        "Izinkan akses kamera",
        "Arahkan kamera ke QR code mesin",
        "Tunggu hingga QR code terdeteksi"
      ]
    },
    {
      step: 3,
      title: "Masukkan Botol",
      description: "Masukkan botol plastik bekas ke dalam mesin pengumpul secara bertahap.",
      icon: Recycle,
      details: [
        "Pastikan botol dalam kondisi bersih",
        "Masukkan satu per satu ke mesin",
        "Tunggu konfirmasi dari mesin",
        "Mesin akan mendeteksi dan menghitung botol"
      ]
    },
    {
      step: 4,
      title: "Dapatkan Poin",
      description: "Setiap botol yang berhasil didaur ulang akan memberikan poin reward.",
      icon: Coins,
      details: [
        "1 botol = 10 poin",
        "Poin akan langsung ditambahkan ke wallet",
        "Poin dapat ditukar dengan uang atau produk",
        "Lihat riwayat poin di menu History"
      ]
    }
  ];

  const tips = [
    {
      title: "Persiapan Botol",
      items: [
        "Cuci bersih botol sebelum dimasukkan",
        "Pastikan botol tidak ada tutup atau label",
        "Botol harus dalam kondisi utuh",
        "Hindari botol kaca atau logam"
      ],
      icon: CheckCircle
    },
    {
      title: "Waktu Operasional",
      items: [
        "Mesin beroperasi 24 jam",
        "Pastikan mesin dalam kondisi aktif",
        "Hubungi admin jika mesin bermasalah",
        "Cek status mesin sebelum menggunakan"
      ],
      icon: Clock
    },
    {
      title: "Keamanan & Etika",
      items: [
        "Jangan memaksa botol yang tidak cocok",
        "Gunakan mesin dengan bertanggung jawab",
        "Laporkan kerusakan mesin ke admin",
        "Bantu jaga kebersihan area mesin"
      ],
      icon: AlertCircle
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <InfoIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-foreground">
            Cara Penggunaan Replas
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Panduan lengkap untuk menggunakan sistem pengumpulan botol bekas dan mendapatkan reward poin.
        </p>
        <Badge variant="secondary" className="text-sm">
          Versi 2.0 - Updated 2024
        </Badge>
      </div>

      {/* Langkah-langkah Penggunaan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Langkah-langkah Penggunaan
          </CardTitle>
          <CardDescription>
            Ikuti langkah-langkah berikut untuk menggunakan sistem Replas dengan benar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {step.step}
                    </Badge>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                  <ul className="space-y-1 ml-4">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Tips & Panduan */}
      <div className="grid md:grid-cols-3 gap-6">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tip.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pertanyaan Umum (FAQ)</CardTitle>
          <CardDescription>
            Jawaban untuk pertanyaan yang sering ditanyakan pengguna.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Berapa poin yang saya dapatkan per botol?</h4>
            <p className="text-sm text-muted-foreground">Setiap botol plastik yang berhasil didaur ulang memberikan 10 poin ke wallet Anda.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Bagaimana cara menukar poin dengan uang?</h4>
            <p className="text-sm text-muted-foreground">Poin dapat ditukar melalui menu Konversi di dashboard. Minimum penukaran adalah 100 poin.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Apa yang harus dilakukan jika mesin tidak merespons?</h4>
            <p className="text-sm text-muted-foreground">Periksa koneksi internet Anda dan pastikan mesin dalam kondisi aktif. Jika masih bermasalah, hubungi admin.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Apakah ada batas waktu untuk menggunakan mesin?</h4>
            <p className="text-sm text-muted-foreground">Setiap sesi penggunaan mesin memiliki batas waktu 5 menit. Jika melebihi batas, sesi akan otomatis berakhir.</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Butuh Bantuan?</h3>
            <p className="text-muted-foreground">
              Jika Anda mengalami kesulitan atau memiliki pertanyaan lain, jangan ragu untuk menghubungi tim support kami.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <InfoIcon className="w-4 h-4" />
                Hubungi Support
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Lapor Masalah
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
