import React, { useContext, useState } from "react";
import { LanguageContext } from "../root";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Footer from "../components/footer";

// Define translations for Contact page
const translations = {
  id: {
    title: "Hubungi Kami",
    subtitle: "Kami Siap Membantu Anda",
    intro:
      "Ada pertanyaan tentang layanan Replas? Ingin bermitra dengan kami? Atau butuh bantuan teknis? Tim kami siap membantu Anda 24/7. Hubungi kami melalui berbagai kanal yang tersedia.",
    contactInfoTitle: "Informasi Kontak",
    addressTitle: "Alamat Kantor Pusat",
    address: "Jl. Teknologi Hijau No. 123, Malang, Jawa Timur 65145, Indonesia",
    phoneTitle: "Telepon",
    phone: "+62 123 456 789",
    emailTitle: "Email",
    email: "info@replas.com",
    hoursTitle: "Jam Operasional",
    hours:
      "Senin - Jumat: 08:00 - 17:00 WIB\nSabtu: 09:00 - 15:00 WIB\nMinggu: Tutup",
    contactFormTitle: "Kirim Pesan",
    nameLabel: "Nama Lengkap",
    emailLabel: "Alamat Email",
    subjectLabel: "Subjek",
    messageLabel: "Pesan",
    sendButton: "Kirim Pesan",
    faqTitle: "Pertanyaan Umum",
    faq1Question: "Bagaimana cara menggunakan Replas Bank?",
    faq1Answer:
      "Unduh aplikasi Replas, daftar akun, temukan mesin terdekat, scan QR code, dan mulai setorkan botol plastik Anda.",
    faq2Question: "Berapa nilai tukar per botol?",
    faq2Answer:
      "Nilai tukar bervariasi tergantung jenis dan kualitas botol. Rata-rata Rp 400-500 per botol PET standar.",
    faq3Question: "Apakah aman menggunakan layanan Replas?",
    faq3Answer:
      "Ya, sangat aman. Kami menggunakan teknologi enkripsi dan autentikasi biometrik untuk melindungi data dan transaksi Anda.",
    faq4Question: "Bagaimana cara menarik dana dari akun Replas?",
    faq4Answer:
      "Dana dapat ditarik ke rekening bank atau dompet digital setelah mencapai minimum penarikan Rp 50.000.",
    locationsTitle: "Lokasi Replas Bank",
    location1: "SMKN 6 Malang - Jl. Veteran No. 8, Malang",
    location2: "Mall Dinoyo City - Jl. Dinoyo No. 123, Malang",
    location3: "Universitas Brawijaya - Jl. Veteran, Malang",
    location4: "Bandara Abdul Rachman Saleh - Jl. Pattimura, Malang",
    partnershipTitle: "Bermitra Dengan Kami",
    partnershipDesc:
      "Tertarik menjadi mitra Replas? Kami mencari lokasi strategis untuk menempatkan mesin Replas Bank. Hubungi tim partnership kami untuk diskusi lebih lanjut.",
    partnershipButton: "Ajukan Partnership",
    socialTitle: "Ikuti Kami",
    socialDesc:
      "Tetap terhubung dengan perkembangan terbaru Replas melalui media sosial kami.",
  },
  en: {
    title: "Contact Us",
    subtitle: "We're Here to Help",
    intro:
      "Have questions about Replas services? Want to partner with us? Or need technical support? Our team is ready to help you 24/7. Contact us through our available channels.",
    contactInfoTitle: "Contact Information",
    addressTitle: "Head Office Address",
    address: "Jl. Teknologi Hijau No. 123, Malang, East Java 65145, Indonesia",
    phoneTitle: "Phone",
    phone: "+62 123 456 789",
    emailTitle: "Email",
    email: "info@replas.com",
    hoursTitle: "Operating Hours",
    hours:
      "Monday - Friday: 08:00 - 17:00 WIB\nSaturday: 09:00 - 15:00 WIB\nSunday: Closed",
    contactFormTitle: "Send Message",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    subjectLabel: "Subject",
    messageLabel: "Message",
    sendButton: "Send Message",
    faqTitle: "Frequently Asked Questions",
    faq1Question: "How to use Replas Bank?",
    faq1Answer:
      "Download the Replas app, create an account, find the nearest machine, scan QR code, and start depositing your plastic bottles.",
    faq2Question: "What's the exchange value per bottle?",
    faq2Answer:
      "Exchange value varies depending on type and quality of bottles. Average Rp 400-500 per standard PET bottle.",
    faq3Question: "Is it safe to use Replas services?",
    faq3Answer:
      "Yes, very safe. We use encryption technology and biometric authentication to protect your data and transactions.",
    faq4Question: "How to withdraw funds from Replas account?",
    faq4Answer:
      "Funds can be withdrawn to bank account or digital wallet after reaching minimum withdrawal of Rp 50,000.",
    locationsTitle: "Replas Bank Locations",
    location1: "SMKN 6 Malang - Jl. Veteran No. 8, Malang",
    location2: "Mall Dinoyo City - Jl. Dinoyo No. 123, Malang",
    location3: "Universitas Brawijaya - Jl. Veteran, Malang",
    location4: "Abdul Rachman Saleh Airport - Jl. Pattimura, Malang",
    partnershipTitle: "Partner With Us",
    partnershipDesc:
      "Interested in becoming a Replas partner? We're looking for strategic locations to place Replas Bank machines. Contact our partnership team for further discussion.",
    partnershipButton: "Apply for Partnership",
    socialTitle: "Follow Us",
    socialDesc:
      "Stay connected with the latest Replas developments through our social media.",
  },
};

export function meta() {
  return [
    { title: "Contact - Replas" },
    {
      name: "description",
      content:
        "Get in touch with Replas team for support, partnerships, and inquiries.",
    },
  ];
}

export default function Contact() {
  const { lang } = useContext(LanguageContext);
  const t = (key: keyof (typeof translations)["id"]) =>
    translations[lang][key] || key;

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
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-[#D8EEE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-foreground mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t("intro")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-extrabold mb-8 text-green-600">
                {t("contactInfoTitle")}
              </h2>
              <div className="space-y-6">
                <Card className="border-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 text-green-600 mr-3" />
                      <CardTitle className="text-lg">
                        {t("addressTitle")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t("address")}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-green-600 mr-3" />
                      <CardTitle className="text-lg">
                        {t("phoneTitle")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t("phone")}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-green-600 mr-3" />
                      <CardTitle className="text-lg">
                        {t("emailTitle")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t("email")}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center">
                      <Clock className="w-6 h-6 text-green-600 mr-3" />
                      <CardTitle className="text-lg">
                        {t("hoursTitle")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base whitespace-pre-line">
                      {t("hours")}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-extrabold mb-8 text-green-600">
                {t("contactFormTitle")}
              </h2>
              <Card className="border-accent">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("nameLabel")}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("emailLabel")}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("subjectLabel")}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("messageLabel")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t("sendButton")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-6 text-green-600">
              {t("faqTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-lg">{t("faq1Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("faq1Answer")}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-lg">{t("faq2Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("faq2Answer")}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-lg">{t("faq3Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("faq3Answer")}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-lg">{t("faq4Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("faq4Answer")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-6 text-green-600">
              {t("locationsTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-accent">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">SMKN 6 Malang</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("location1")}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Mall Dinoyo City</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("location2")}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Universitas Brawijaya</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("location3")}</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-accent">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">
                  Bandara Abdul Rachman Saleh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("location4")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-green-600">
              {t("partnershipTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {t("partnershipDesc")}
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg">
              {t("partnershipButton")}
            </Button>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-green-600">
            {t("socialTitle")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            {t("socialDesc")}
          </p>
          <div className="flex justify-center space-x-8">
            <a
              href="#"
              className="text-green-600 hover:text-green-700 text-3xl"
            >
              📘
            </a>
            <a
              href="#"
              className="text-green-600 hover:text-green-700 text-3xl"
            >
              🐦
            </a>
            <a
              href="#"
              className="text-green-600 hover:text-green-700 text-3xl"
            >
              📷
            </a>
            <a
              href="#"
              className="text-green-600 hover:text-green-700 text-3xl"
            >
              💼
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
