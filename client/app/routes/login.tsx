import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaGoogle, FaFacebookSquare } from "react-icons/fa";

export function meta() {
  return [
    { title: "Login - Replas" },
    { name: "description", content: "Login to your Replas account to access recycling services." },
  ];
}

export default function Login() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Basic validation
    if (!formData.email) {
      setMessage(t('login.emailRequired'));
      setIsLoading(false);
      return;
    }
    if (!formData.password) {
      setMessage(t('login.passwordRequired'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(t('login.loginSuccess'));
        // Store token
        localStorage.setItem('token', data.token);

        // Check for redirect URL first
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        if (redirect) {
          window.location.href = redirect;
        } else {
          // Redirect based on role
          if (data.user.role === 'admin') {
            window.location.href = '/dashboard/admin';
          } else {
            window.location.href = '/dashboard/user';
          }
        }
      } else {
        const error = await response.json();
        setMessage(error.message || t('login.loginError'));
      }
    } catch (error) {
      setMessage(t('login.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img src="/logo_3.webp" alt="Replas Logo" className="mx-auto h-25 w-auto" />
          <h2 className="text-3xl font-extrabold text-foreground">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              {t('login.loginFormTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('login.emailLabel')}
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
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  {t('login.passwordLabel')}
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
                    placeholder="••••••••"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    {t('login.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-green-600 hover:text-green-500">
                    {t('login.forgotPassword')}
                  </a>
                </div>
              </div>

              {message && (
                <div className={`text-sm text-center ${message === t('login.loginSuccess') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {isLoading ? t('login.processing') : t('login.loginButton')}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    {t('login.orContinueWith')}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <span className="ml-2"><FaFacebookSquare/></span>
                  {t('login.facebookLogin')}
                </Button>
                <Button variant="outline" className="w-full">
                  <span className="ml-2"><FaGoogle/></span>
                  {t('login.googleLogin')}
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('login.noAccount')}{' '}
                <a href="/register" className="text-green-600 hover:text-green-500 font-medium">
                  {t('login.signUp')}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
