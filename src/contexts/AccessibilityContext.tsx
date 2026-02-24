import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AccessibilityContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  magnifier: boolean;
  toggleMagnifier: () => void;
  ttsActive: boolean;
  toggleTTS: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [magnifier, setMagnifier] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);

  const increaseFontSize = useCallback(() => setFontSize((s) => Math.min(s + 10, 150)), []);
  const decreaseFontSize = useCallback(() => setFontSize((s) => Math.max(s - 10, 80)), []);
  const toggleHighContrast = useCallback(() => setHighContrast((v) => !v), []);
  const toggleMagnifier = useCallback(() => setMagnifier((v) => !v), []);
  const toggleTTS = useCallback(() => {
    setTtsActive((v) => {
      if (v) {
        window.speechSynthesis?.cancel();
      }
      return !v;
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (!ttsActive) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent;
      if (text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ttsActive]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        highContrast,
        toggleHighContrast,
        magnifier,
        toggleMagnifier,
        ttsActive,
        toggleTTS,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
};
