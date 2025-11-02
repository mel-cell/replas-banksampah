import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Sun, Moon, Languages } from "lucide-react";
import { Button } from "./components/ui/button";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const LanguageContext = createContext({
  lang: "id" as "id" | "en",
  setLang: (lang: "id" | "en") => {},
});

export function Layout({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "id" | "en" | null;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const changeLang = (newLang: "id" | "en") => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
        <Layout isDark={isDark}>
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex items-center">
                  <Link to="/" className=" flex items-center">
                    <img
                      src="/logo_3.webp"
                      alt="Replas Logo"
                      className="w-20 h-20"
                    />
                     <span className="text-xl font-bold text-primary">Replas</span>
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link
                      to="/"
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      to="/about"
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      About
                    </Link>
                    <Link
                      to="/services"
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Services
                    </Link>
                    <Link
                      to="/contact"
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">

                  {/* Language Selector */}
                  <select
                    value={lang}
                    onChange={(e) => changeLang(e.target.value as "id" | "en")}
                    className="text-foreground bg-background border border-border rounded px-2 py-1 text-sm"
                  >
                    <option value="id">ID</option>
                    <option value="en">EN</option>
                  </select>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded hover:bg-accent transition-colors"
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5 text-foreground" />
                    ) : (
                      <Moon className="w-5 h-5 text-foreground" />
                    )}
                  </button>
                  <Link to="/login">
                    <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      Register
                    </Button>
                  </Link>

                  {/* Mobile menu button - placeholder for now */}
                  <div className="md:hidden">
                    <button className="text-foreground hover:text-primary">
                      Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Spacer for fixed navbar */}
          <div className="pt-16">
            <Outlet />
          </div>
        </Layout>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
