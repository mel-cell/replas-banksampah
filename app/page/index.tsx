import React, { useContext } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { User, MapPin, Barcode, KeyRound, Recycle, Bell, DollarSign } from "lucide-react"
import { Link } from "react-router"
import { LanguageContext } from "../root"
import Footer from "../components/footer"

// Define translations
const translations = {
  id: {
    // Hero
    heroSubtitle: "Replas - Recycle To E-Money",
    heroTitle: "Hai Sobat AKSATA Butuh Cuan Tambahan Ga ?",
    heroDescription: "Replas - Recycle To E-Money adalah sebuah Platform yang dibuat untuk membantu para teman-teman SMKN 6 Malang dalam dapatin cuan untuk jajan nih",
    heroButton: "Dapatkan sekarang",

    // What is Replas?
    whatIsTitle: "Apa itu Replas?",
    whatIsDescription: "Replas adalah platform yang mengubah daur ulang Anda menjadi e-money, mempromosikan keberlanjutan dan peluang penghasilan.",
    card1Title: "Daur Ulang Berkembang",
    card1Desc: "Upaya daur ulang Anda berkembang menjadi nilai nyata dan dampak lingkungan.",
    card2Title: "Selalu Ramah Lingkungan",
    card2Desc: "Proses berkelanjutan 100% yang melindungi planet kita.",
    card3Title: "Dapatkan E-Money",
    card3Desc: "Ubah limbah menjadi uang digital secara instan dan mudah.",
    card4Title: "Didorong Komunitas",
    card4Desc: "Bergabunglah dengan komunitas pelaku daur ulang sadar lingkungan yang membuat perbedaan.",

    // Use Cases
    useCasesTitle: "Kasus Penggunaan",
    useCasesDescription: "Temukan bagaimana Replas dapat menguntungkan bisnis dan individu.",
    businessTitle: "Bisnis",
    businessDesc: "Sederhanakan pengelolaan limbah untuk perusahaan, tingkatkan inisiatif CSR, dan ubah daur ulang menjadi aliran pendapatan.",
    personalTitle: "Pribadi",
    personalDesc: "Dapatkan e-money dari daur ulang harian di rumah atau dalam perjalanan, mendukung gaya hidup yang lebih hijau.",

    // Replas Bank
    replasBankTitle: "Replas Bank - Mesin Daur Ulang Anda",
    replasBankDesc: "Replas Bank adalah mesin inovatif yang membuat daur ulang mudah dan bermanfaat. Setorkan botol plastik Anda dan lihat mereka berubah menjadi poin e-money.",
    replasBankList1: "Pemindaian dan pemrosesan otomatis",
    replasBankList2: "Antarmuka aman dan ramah pengguna",
    replasBankList3: "Tersedia di lokasi yang nyaman",

    // How It Works
    howItWorksTitle: "Cara Kerjanya",
    howItWorksDesc: "Ikuti langkah-langkah sederhana ini untuk mulai mendapatkan dari daur ulang Anda.",
    step1Title: "1. Login ke Platform",
    step1Desc: "Masuk ke akun Replas Anda untuk memulai.",
    step2Title: "2. Temukan Mesin Terdekat",
    step2Desc: "Temukan Replas Bank terdekat menggunakan aplikasi.",
    step3Title: "3. Scan Barcode",
    step3Desc: "Scan kode QR pada mesin untuk terhubung.",
    step4Title: "4. Login ke Ruangan",
    step4Desc: "Otentikasi untuk mengakses ruangan Replas Bank.",
    step5Title: "5. Setor Botol",
    step5Desc: "Masukkan botol plastik Anda ke dalam mesin.",
    step6Title: "6. Dapatkan Notifikasi",
    step6Desc: "Terima konfirmasi untuk setiap scan berhasil dan konversi poin.",
    step7Title: "7. Tukar Poin",
    step7Desc: "Tukar poin yang terkumpul menjadi uang Rupiah nyata ketika mencapai ambang batas.",

    // CTA
    ctaTitle: "Siap Mulai Daur Ulang dan Menghasilkan?",
    ctaDesc: "Bergabunglah dengan Replas hari ini dan ubah limbah Anda menjadi kekayaan.",
    ctaButton: "Mulai Sekarang",
  },
  en: {
    // Hero
    heroSubtitle: "Replas - Recycle To E-Money",
    heroTitle: "Hi AKSATA Friends, Need Extra Cash?",
    heroDescription: "Replas - Recycle To E-Money is a platform created to help SMKN 6 Malang students earn pocket money through recycling.",
    heroButton: "Get Now",

    // What is Replas?
    whatIsTitle: "What is Replas?",
    whatIsDescription: "Replas is a platform that turns your recycling into e-money, promoting sustainability and earning opportunities.",
    card1Title: "Recycle Grows",
    card1Desc: "Your recycling efforts grow into real value and environmental impact.",
    card2Title: "Always Eco-Friendly",
    card2Desc: "100% sustainable processes that protect our planet.",
    card3Title: "Earn E-Money",
    card3Desc: "Convert waste to digital money instantly and easily.",
    card4Title: "Community Driven",
    card4Desc: "Join a community of eco-conscious recyclers making a difference.",

    // Use Cases
    useCasesTitle: "Use Cases",
    useCasesDescription: "Discover how Replas can benefit both businesses and individuals.",
    businessTitle: "Business",
    businessDesc: "Streamline waste management for companies, enhance CSR initiatives, and turn recycling into revenue streams.",
    personalTitle: "Personal",
    personalDesc: "Earn e-money from daily recycling at home or on the go, supporting a greener lifestyle.",

    // Replas Bank
    replasBankTitle: "Replas Bank - Your Recycling Machine",
    replasBankDesc: "Replas Bank is the innovative machine that makes recycling easy and rewarding. Deposit your plastic bottles and watch them turn into e-money points.",
    replasBankList1: "Automated scanning and processing",
    replasBankList2: "Secure and user-friendly interface",
    replasBankList3: "Available at convenient locations",

    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksDesc: "Follow these simple steps to start earning from your recycling.",
    step1Title: "1. Login to Platform",
    step1Desc: "Sign in to your Replas account to get started.",
    step2Title: "2. Find Nearest Machine",
    step2Desc: "Locate the closest Replas Bank using the app.",
    step3Title: "3. Scan Barcode",
    step3Desc: "Scan the QR code on the machine to connect.",
    step4Title: "4. Login to Room",
    step4Desc: "Authenticate to access the Replas Bank room.",
    step5Title: "5. Deposit Bottle",
    step5Desc: "Insert your plastic bottle into the machine.",
    step6Title: "6. Get Notification",
    step6Desc: "Receive confirmation for each successful scan and point conversion.",
    step7Title: "7. Redeem Points",
    step7Desc: "Exchange accumulated points for real Rupiah money when you reach the threshold.",

    // CTA
    ctaTitle: "Ready to Start Recycling and Earning?",
    ctaDesc: "Join Replas today and turn your waste into wealth.",
    ctaButton: "Get Started Now",

    
  }
};

export default function Home() {
  const { lang } = useContext(LanguageContext);
  const t = (key: keyof typeof translations['id']) => translations[lang][key] || key;

  return (
    <>
      {/* Hero Section */}
      <div className="w-full">
        <div className="w-11/12 h-9/10 p-10 mx-20 flex justify-center items-center bg-[#D8EEE6] dark:bg-gray-800 rounded-4xl my-10">
          {/* bagian contents  */}
          <div className="w-1/2">
          <div>
            <h1 className="opacity-50 text-foreground text-2sm">
              {t('heroSubtitle')}
            </h1>
            <h2 className="mt-2 text-6xl font-extrabold">
              {lang === 'id' ? (
                <>Hai Sobat <span className="text-green-500 italic">AKSATA</span> Butuh Cuan Tambahan Ga ?</>
              ) : (
                <>Hi <span className="text-green-500 italic">AKSATA</span> Friends, Need Extra Cash?</>
              )}
            </h2>
            <p className="text-foreground mt-4 opacity-60 text-base font-bold">
              {t('heroDescription')}
            </p>
          </div>
            <div className="mt-5">
              <Button className="border-2sm border-primary">{t('heroButton')}</Button>
            </div>
          </div>

          {/* img hero   */}
          <div className="w-1/2">
            <img src="/city.webp" alt="bg-plant" className=" w-6/7 ml-auto relative h-fit " />
          </div>
        </div>
      </div>

      {/* What is Replas? Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-foreground mb-4">
              {t('whatIsTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('whatIsDescription')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="growth" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('card1Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('card1Desc')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="eco" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('card2Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('card2Desc')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="money" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('card3Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('card3Desc')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="community" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('card4Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('card4Desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-foreground mb-4">
              {t('useCasesTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('useCasesDescription')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Use Case */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <img src="/hero.webp" alt="business" className="w-10 h-10 object-cover rounded-full" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600 text-center">{t('businessTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-lg">
                  {t('businessDesc')}
                </CardDescription>
                <div className="mt-6">
                  <img src="/hero.webp" alt="business img" className="w-full h-48 object-cover rounded-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Personal Use Case */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <img src="/hero.webp" alt="personal" className="w-10 h-10 object-cover rounded-full" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600 text-center">{t('personalTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-lg">
                  {t('personalDesc')}
                </CardDescription>
                <div className="mt-6">
                  <img src="/hero.webp" alt="personal img" className="w-full h-48 object-cover rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Replas Bank Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-foreground mb-6">
                {t('replasBankTitle')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('replasBankDesc')}
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li>• {t('replasBankList1')}</li>
                <li>• {t('replasBankList2')}</li>
                <li>• {t('replasBankList3')}</li>
              </ul>
            </div>
            <div className="text-center">
              <img src="/hero.webp" alt="Replas Bank machine" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-foreground mb-4">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('howItWorksDesc')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step1Title')}</h3>
              <p className="text-muted-foreground">{t('step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step2Title')}</h3>
              <p className="text-muted-foreground">{t('step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Barcode className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step3Title')}</h3>
              <p className="text-muted-foreground">{t('step3Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step4Title')}</h3>
              <p className="text-muted-foreground">{t('step4Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step5Title')}</h3>
              <p className="text-muted-foreground">{t('step5Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step6Title')}</h3>
              <p className="text-muted-foreground">{t('step6Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step7Title')}</h3>
              <p className="text-muted-foreground">{t('step7Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-foreground mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('ctaDesc')}
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            {t('ctaButton')}
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
