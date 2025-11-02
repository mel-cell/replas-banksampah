import React, { useContext } from "react";
import { LanguageContext } from "../root";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Footer from "../components/footer";

// Define translations for About page
const translations = {
  id: {
    title: "Tentang Replas",
    subtitle: "Mengenal Lebih Dalam Platform Daur Ulang Inovatif Kami",
    intro: "Replas adalah platform terdepan yang mengubah cara kita memandang daur ulang. Dengan teknologi canggih dan komitmen terhadap keberlanjutan, kami membantu masyarakat mendapatkan manfaat finansial dari kegiatan daur ulang sehari-hari.",
    missionTitle: "Misi Kami",
    missionDesc: "Misi utama Replas adalah menciptakan ekosistem daur ulang yang menguntungkan bagi semua pihak. Kami percaya bahwa keberlanjutan lingkungan dapat berjalan seiring dengan kemajuan ekonomi.",
    visionTitle: "Visi Kami",
    visionDesc: "Menjadi pemimpin global dalam transformasi limbah menjadi nilai ekonomi, menciptakan dunia di mana daur ulang adalah bagian integral dari gaya hidup modern.",
    historyTitle: "Sejarah Kami",
    historyDesc: "Didirikan pada tahun 2024 oleh tim ahli teknologi dan lingkungan, Replas lahir dari visi untuk mengatasi masalah limbah plastik yang semakin meningkat di Indonesia, khususnya di sekolah-sekolah seperti SMKN 6 Malang.",
    teamTitle: "Tim Kami",
    teamDesc: "Tim kami terdiri dari para ahli di bidang teknologi, lingkungan, dan bisnis yang berkomitmen untuk menciptakan solusi inovatif bagi masalah daur ulang.",
    impactTitle: "Dampak Kami",
    impactDesc: "Sejak diluncurkan, Replas telah berhasil mengurangi jutaan ton limbah plastik dari lingkungan dan memberikan penghasilan tambahan bagi ribuan pengguna.",
    futureTitle: "Masa Depan",
    futureDesc: "Kami terus berinovasi untuk memperluas jangkauan layanan, mengintegrasikan teknologi AI untuk pengenalan material yang lebih akurat, dan memperluas jaringan mesin Replas Bank ke seluruh Indonesia.",
    ctaButton: "Bergabung Bersama Kami",
  },
  en: {
    title: "About Replas",
    subtitle: "Get to Know Our Innovative Recycling Platform",
    intro: "Replas is a leading platform that changes the way we view recycling. With advanced technology and commitment to sustainability, we help communities benefit financially from daily recycling activities.",
    missionTitle: "Our Mission",
    missionDesc: "Replas's main mission is to create a recycling ecosystem that benefits all parties. We believe that environmental sustainability can go hand in hand with economic progress.",
    visionTitle: "Our Vision",
    visionDesc: "To become a global leader in transforming waste into economic value, creating a world where recycling is an integral part of modern lifestyle.",
    historyTitle: "Our History",
    historyDesc: "Founded in 2024 by a team of technology and environmental experts, Replas was born from the vision to address the growing plastic waste problem in Indonesia, especially in schools like SMKN 6 Malang.",
    teamTitle: "Our Team",
    teamDesc: "Our team consists of experts in technology, environment, and business who are committed to creating innovative solutions for recycling problems.",
    impactTitle: "Our Impact",
    impactDesc: "Since launching, Replas has successfully reduced millions of tons of plastic waste from the environment and provided additional income for thousands of users.",
    futureTitle: "The Future",
    futureDesc: "We continue to innovate to expand our service reach, integrate AI technology for more accurate material recognition, and expand the Replas Bank machine network throughout Indonesia.",
    ctaButton: "Join Us",
  }
};

export function meta() {
  return [
    { title: "About - Replas" },
    { name: "description", content: "Learn more about Replas and our mission to revolutionize recycling." },
  ];
}

export default function About() {
  const { lang } = useContext(LanguageContext);
  const t = (key: keyof typeof translations['id']) => translations[lang][key] || key;

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

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">{t('missionTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t('missionDesc')}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">{t('visionTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t('visionDesc')}
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
              {t('historyTitle')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t('historyDesc')}
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
            {t('teamTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            {t('teamDesc')}
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
                {t('impactTitle')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t('impactDesc')}
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
            {t('futureTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-12">
            {t('futureDesc')}
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
            {t('ctaButton')}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
