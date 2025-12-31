import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaGoogle, FaFacebookSquare } from "react-icons/fa";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Login - Replas" },
    { name: "description", content: "Login to your Replas account." },
  ];
}

export default function Login() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage(t("login.emailRequired") || "Fields required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href =
            data.user.role === "admin" ? "/dashboard/admin" : "/dashboard/user";
        }, 1000);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row font-sans">
      {/* Left Side - Visuals */}
      <div className="lg:w-1/2 relative bg-gray-900 hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-new.png')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-gray-900/50 to-gray-900/20"></div>

        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/logo_3.webp"
            alt="Replas Logo"
            className="w-10 h-10 object-contain brightness-0 invert"
          />
          <span className="text-xl font-bold text-white">Replas</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome Back to the Green Revolution.
          </h1>
          <p className="text-lg text-emerald-100/80 leading-relaxed">
            Manage your recycling activities, track rewards, and contribute to a
            sustainable future with Replas.
          </p>
        </div>

        <div className="relative z-10 text-sm text-gray-400">
          © 2025 Replas Inc.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 lg:top-12 lg:left-12 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("login.title") || "Sign In"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t("login.subtitle") ||
                "Enter your details to access your account."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("login.emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("login.passwordLabel")}
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                >
                  {t("login.forgotPassword")}
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm text-center ${message.includes("success") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Logging in...</span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <LogIn className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-950 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FaFacebookSquare className="mr-2 text-blue-600" /> Facebook
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-emerald-600 hover:text-emerald-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
