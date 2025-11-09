import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer";
import Navbar from "~/components/Navbar";

export function meta() {
  return [
    { title: "About - Replas" },
    { name: "description", content: "Learn more about Replas and our mission to revolutionize recycling." },
  ];
}

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      {/* Hero Section */}
      <section className="py-20 bg-[#D8EEE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-foreground mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t('about.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">{t('about.missionTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t('about.missionDesc')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">{t('about.visionTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t('about.visionDesc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-8 text-green-600">
              {t('about.historyTitle')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t('about.historyDesc')}
            </p>
            <div className="bg-[#D8EEE6] p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Tahun 2024: Awal Perjalanan</h3>
              <p className="text-muted-foreground">
                Replas didirikan dengan fokus pada komunitas sekolah untuk mengatasi masalah limbah plastik yang semakin meningkat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold mb-8 text-green-600">
            {t('about.teamTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            {t('about.teamDesc')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-accent">
              <CardHeader>
                <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <CardTitle>Tim Teknologi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ahli dalam pengembangan platform digital dan integrasi IoT untuk mesin daur ulang.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <CardTitle>Tim Lingkungan</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Spesialis dalam kebijakan lingkungan dan edukasi daur ulang berkelanjutan.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <CardTitle>Tim Bisnis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ahli dalam pengembangan model bisnis dan kemitraan strategis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-8 text-green-600">
                {t('about.impactTitle')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t('about.impactDesc')}
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Mengurangi 500+ ton limbah plastik per bulan
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Memberikan penghasilan tambahan untuk 10,000+ pengguna
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Mendukung 50+ sekolah dan komunitas
                </li>
              </ul>
            </div>
            <div className="text-center">
              <img src="/hero.webp" alt="Impact illustration" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Future */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold mb-8 text-green-600">
            {t('about.futureTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-12">
            {t('about.futureDesc')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-xl">AI Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Penggunaan kecerdasan buatan untuk identifikasi material yang lebih akurat dan efisien.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-xl">Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Perluasan jaringan mesin Replas Bank ke seluruh Indonesia dan mancanegara.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pengembangan fitur-fitur baru untuk meningkatkan pengalaman pengguna.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#D8EEE6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-foreground mb-6">
            Siap Berkontribusi untuk Lingkungan?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Bergabunglah dengan Replas dan jadilah bagian dari revolusi daur ulang.
          </p>
          <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg">
            {t('about.ctaButton')}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
