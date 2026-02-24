import { Volume2, ZoomIn, Eye, Languages, Plus, Minus } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AccessibilityToolbar = () => {
  const [open, setOpen] = useState(false);
  const { increaseFontSize, decreaseFontSize, highContrast, toggleHighContrast, magnifier, toggleMagnifier, ttsActive, toggleTTS } = useAccessibility();
  const { lang, toggleLanguage, t } = useLanguage();

  const buttons = [
    { icon: <Volume2 size={18} />, label: t("Text-to-Speech", "Texto a Voz"), active: ttsActive, onClick: toggleTTS },
    { icon: <Minus size={18} />, label: "A-", active: false, onClick: decreaseFontSize },
    { icon: <Plus size={18} />, label: "A+", active: false, onClick: increaseFontSize },
    { icon: <ZoomIn size={18} />, label: t("Magnifier", "Lupa"), active: magnifier, onClick: toggleMagnifier },
    { icon: <Eye size={18} />, label: t("High Contrast", "Alto Contraste"), active: highContrast, onClick: toggleHighContrast },
    { icon: <Languages size={18} />, label: lang === "en" ? "Español" : "English", active: false, onClick: toggleLanguage },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-xl"
          >
            {buttons.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  btn.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        aria-label="Accessibility options"
      >
        <Eye size={22} />
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
