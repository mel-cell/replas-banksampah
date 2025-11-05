import React, { useContext } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { User, MapPin, Barcode, KeyRound, Recycle, Bell, DollarSign } from "lucide-react"
import { Link } from "react-router"
import { LanguageContext } from "../root"
import { useTranslation } from "react-i18next";
import Footer from "../components/footer"

export default function Home() {
  const { t, i18n } = useTranslation();
  const { lang } = useContext(LanguageContext);

  return (
    <>
      {/* Hero Section */}
      <div className="w-full">
        <div className="w-11/12 h-9/10 p-10 mx-20 flex justify-center items-center bg-[#D8EEE6] dark:bg-gray-800 rounded-4xl my-10">
          {/* bagian contents  */}
          <div className="w-1/2">
          <div>
            <h1 className="opacity-50 text-foreground text-2sm">
              {t('hero.subtitle')}
            </h1>
            <h2 className="mt-2 text-6xl font-extrabold">
              {t('hero.title')}
            </h2>
            <p className="text-foreground mt-4 opacity-60 text-base font-bold">
              {t('hero.description')}
            </p>
          </div>
            <div className="mt-5">
              <Button className="border-2sm border-primary">{t('hero.button')}</Button>
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
              {t('whatIs.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('whatIs.description')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="growth" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('whatIs.card1Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('whatIs.card1Desc')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="eco" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('whatIs.card2Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('whatIs.card2Desc')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="money" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('whatIs.card3Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('whatIs.card3Desc')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <img src="/hero.webp" alt="community" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">{t('whatIs.card4Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t('whatIs.card4Desc')}
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
              {t('useCases.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('useCases.description')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Use Case */}
            <Card className="border-accent hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <img src="/hero.webp" alt="business" className="w-10 h-10 object-cover rounded-full" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600 text-center">{t('useCases.businessTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-lg">
                  {t('useCases.businessDesc')}
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
                <CardTitle className="text-2xl font-bold text-green-600 text-center">{t('useCases.personalTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-lg">
                  {t('useCases.personalDesc')}
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
                {t('replasBank.title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('replasBank.desc')}
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li>• {t('replasBank.list1')}</li>
                <li>• {t('replasBank.list2')}</li>
                <li>• {t('replasBank.list3')}</li>
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
              {t('howItWorks.title')}
            </h2> 
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('howItWorks.desc')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step1Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step2Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Barcode className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step3Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step3Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step4Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step4Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step5Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step5Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step6Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step6Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('howItWorks.step7Title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step7Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-foreground mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('cta.desc')}
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            {t('cta.button')}
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
