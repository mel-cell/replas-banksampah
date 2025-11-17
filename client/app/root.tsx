import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/root";
import appStyles from "./app.css?url";
import "./i18n"; // Import i18n configuration

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
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

export default function App() {
  const { i18n } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });
  const [lang, setLang] = useState<"id" | "en">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("lang");
      return (saved as "id" | "en") || "id";
    }
    return "id";
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
    }
  };

  const changeLang = (newLang: "id" | "en") => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
    }
  };

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </LanguageContext.Provider>
        </ThemeContext.Provider>
      </body>
    </html>
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
