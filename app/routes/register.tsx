import React, { useContext, useState } from "react";
import { LanguageContext } from "../root";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";

// Define translations for Register page
const translations = {
  id: {
    title: "Daftar Akun Replas",
    subtitle: "Buat akun baru dan mulai perjalanan daur ulang Anda yang menguntungkan.",
    nameLabel: "Nama Lengkap",
    emailLabel: "Alamat Email",
    phoneLabel: "Nomor Telepon",
    passwordLabel: "Kata Sandi",
    confirmPasswordLabel: "Konfirmasi Kata Sandi",
    agreeTerms: "Saya setuju dengan syarat dan ketentuan",
    createAccount: "Buat Akun",
    haveAccount: "Sudah punya akun?",
    login: "Masuk Sekarang",
    orContinueWith: "Atau daftar dengan",
    googleRegister: "Daftar dengan Google",
    facebookRegister: "Daftar dengan Facebook",
    registerSuccess: "Pendaftaran berhasil! Silakan login.",
    registerError: "Terjadi kesalahan saat pendaftaran",
    nameRequired: "Nama wajib diisi",
    emailRequired: "Email wajib diisi",
    phoneRequired: "Nomor telepon wajib diisi",
    passwordRequired: "Kata sandi wajib diisi",
    passwordsMismatch: "Kata sandi tidak cocok",
    termsRequired: "Anda harus setuju dengan syarat dan ketentuan",
    passwordStrength: "Kata sandi harus minimal 8 karakter dengan huruf besar, kecil, dan angka",
  },
  en: {
    title: "Register Replas Account",
    subtitle: "Create a new account and start your profitable recycling journey.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    agreeTerms: "I agree to the terms and conditions",
    createAccount: "Create Account",
    haveAccount: "Already have an account?",
    login: "Login Now",
    orContinueWith: "Or register with",
    googleRegister: "Register with Google",
    facebookRegister: "Register with Facebook",
    registerSuccess: "Registration successful! Please login.",
    registerError: "Registration error occurred",
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    phoneRequired: "Phone number is required",
    passwordRequired: "Password is required",
    passwordsMismatch: "Passwords do not match",
    termsRequired: "You must agree to the terms and conditions",
    passwordStrength: "Password must be at least 8 characters with uppercase, lowercase, and numbers",
  }
};

export function meta() {
  return [
    { title: "Register - Replas" },
    { name: "description", content: "Register a new account to access Replas recycling services." },
  ];
}

export default function Register() {
  const { lang } = useContext(LanguageContext);
  const t = (key: keyof typeof translations['id']) => translations[lang][key] || key;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePassword = (password: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return strongRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
    if (!formData.name) {
      setMessage(t('nameRequired'));
      setIsLoading(false);
      return;
    }
    if (!formData.email) {
      setMessage(t('emailRequired'));
      setIsLoading(false);
      return;
    }
    if (!formData.phone) {
      setMessage(t('phoneRequired'));
      setIsLoading(false);
      return;
    }
    if (!formData.password) {
      setMessage(t('passwordRequired'));
      setIsLoading(false);
      return;
    }
    if (!validatePassword(formData.password)) {
      setMessage(t('passwordStrength'));
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage(t('passwordsMismatch'));
      setIsLoading(false);
      return;
    }
    if (!formData.agreeTerms) {
      setMessage(t('termsRequired'));
      setIsLoading(false);
      return;
    }

    // Simulate registration API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In real app, this would be an API call
      setMessage(t('registerSuccess'));
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
    } catch (error) {
      setMessage(t('registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img src="/logo_3.webp" alt="Replas Logo" className="mx-auto h-12 w-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-foreground">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Register Form */}
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              Buat Akun Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('nameLabel')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="Nama Lengkap Anda"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('phoneLabel')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="+62 812 3456 7890"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pl-10 pr-10"
                    placeholder="Buat kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  {t('confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="pl-10 pr-10"
                    placeholder="Konfirmasi kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-muted-foreground">
                  {t('agreeTerms')}
                </label>
              </div>

              {message && (
                <div className={`text-sm text-center ${message.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {isLoading ? 'Mendaftar...' : t('createAccount')}
              </Button>
            </form>

            {/* Social Register */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    {t('orContinueWith')}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <span className="mr-2">📘</span>
                  {t('facebookRegister')}
                </Button>
                <Button variant="outline" className="w-full">
                  <span className="mr-2">🔍</span>
                  {t('googleRegister')}
                </Button>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('haveAccount')}{' '}
                <a href="/login" className="text-green-600 hover:text-green-500 font-medium">
                  {t('login')}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
