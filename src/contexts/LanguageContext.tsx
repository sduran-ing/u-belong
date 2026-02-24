import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (en: string, es: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  const t = useCallback(
    (en: string, es: string) => (lang === "en" ? en : es),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
