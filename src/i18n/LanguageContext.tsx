"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { en, ta, TranslationKeys } from "./translations";

type Locale = "en" | "ta";

interface LanguageContextProps {
  locale: Locale;
  t: TranslationKeys;
  switchLanguage: (newLocale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const t = locale === "ta" ? ta : en;

  const switchLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    // Persist user preference
    localStorage.setItem("locale", newLocale);
    
    // Redirect user to the corresponding localized path
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    if (pathParts[1] === "en" || pathParts[1] === "ta") {
      pathParts[1] = newLocale;
    } else {
      pathParts.splice(1, 0, newLocale);
    }
    const newPath = pathParts.join("/");
    window.location.href = newPath;
  };

  useEffect(() => {
    // Check local storage setting
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && savedLocale !== locale) {
      // Sync state if different
      setLocale(savedLocale);
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
