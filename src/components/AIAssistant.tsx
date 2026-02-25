import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Video, Send, Mic, MicOff, VideoOff, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const WELCOME_MESSAGE =
  "👋 Hola! I'm your U Belong assistant. Tell me about your situation and I'll help you understand your rights and create an action plan. You can write in English or Spanish.";

const CHIP_RESPONSES: Record<string, string> = {
  "My employer is threatening to cancel my work permit":
    "I understand how stressful that must be. No employer in Canada has the legal power to cancel your work permit — that is a federal immigration matter handled only by IRCC.\n\n**Situation:** Workplace intimidation — immigration status\n\n**Next steps:**\n1. Document the threat in writing with dates and witnesses\n2. Contact the Migrant Workers Alliance — (416) 531-0778\n3. File a complaint with Employment Standards",
  "I was denied housing because of my accent":
    "I'm sorry you experienced that. Refusing to rent to someone because of their accent or origin violates your provincial Human Rights Code.\n\n**Situation:** Housing discrimination — ethnic origin / language\n\n**Next steps:**\n1. Save all communications — emails, texts, screenshots\n2. File a complaint with your provincial Human Rights Commission (free)\n3. Contact a community legal clinic for help",
  "I need accessibility accommodations at work":
    "You have the right to request accommodations. Your employer must accommodate your disability up to the point of undue hardship — this is protected by law.\n\n**Situation:** Disability accommodation — workplace\n\n**Next steps:**\n1. Put your request in writing to HR\n2. Provide documentation of your barriers (not your full diagnosis)\n3. If refused, contact your provincial Human Rights Commission",
};

const DEFAULT_RESPONSE =
  "Thank you for sharing that. I'd like to help you build a personalized action plan. Click below to generate your step-by-step guide.";

const CHIPS = [
  "My employer is threatening to cancel my work permit",
  "I was denied housing because of my accent",
  "I need accessibility accommodations at work",
];

const AIAssistant = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"chat" | "video">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [chipsUsed, setChipsUsed] = useState<Set<string>>(new Set());

  const addExchange = (userText: string) => {
    const response = CHIP_RESPONSES[userText] || DEFAULT_RESPONSE;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "assistant", text: response },
    ]);
  };

  const handleChip = (chip: string) => {
    setChipsUsed((prev) => new Set(prev).add(chip));
    addExchange(chip);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addExchange(input.trim());
    setInput("");
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown: **bold** and numbered lists
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const numbered = bold.replace(/^(\d+)\.\s/, '<span class="font-semibold">$1.</span> ');
      return (
        <span key={i} dangerouslySetInnerHTML={{ __html: numbered }} className="block" />
      );
    });
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
          {t("Talk to Our AI Assistant", "Habla con Nuestro Asistente de IA")}
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          {t(
            "Get personalized guidance through conversation — in English or Spanish",
            "Obtén orientación personalizada a través de una conversación — en inglés o español"
          )}
        </p>
      </motion.div>

      {/* Mode Tabs */}
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={() => setMode("chat")}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              mode === "chat"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <MessageCircle size={18} /> {t("Chat", "Chat")}
          </button>
          <button
            onClick={() => setMode("video")}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              mode === "video"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Video size={18} /> {t("Video", "Video")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-2xl border shadow-xl"
            >
              {/* Chat messages area */}
              <div
                className="flex flex-col gap-3 overflow-y-auto p-5"
                style={{ backgroundColor: "#FAF7F2", maxHeight: 420, minHeight: 280 }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "assistant"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {renderMarkdown(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Action Plan button after every assistant response (except welcome) */}
                {messages.length > 1 && messages[messages.length - 1].role === "assistant" && (
                  <div className="flex justify-start">
                    <button
                      className="mt-1 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: "#E76F51" }}
                      onClick={() => {}}
                    >
                      {t("Generate My Action Plan", "Generar Mi Plan de Acción")} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick-start chips */}
              {CHIPS.filter((c) => !chipsUsed.has(c)).length > 0 && (
                <div className="flex flex-wrap gap-2 border-t bg-background px-5 py-3">
                  {CHIPS.filter((c) => !chipsUsed.has(c)).map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className="rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div className="flex items-center gap-2 border-t bg-background px-4 py-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("Describe your situation...", "Describe tu situación...")}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button className="text-muted-foreground" aria-label="Microphone">
                  <Mic size={20} />
                </button>
                <button
                  onClick={handleSend}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-2xl border shadow-xl"
            >
              {/* Video frame */}
              <div
                className="relative flex items-center justify-center"
                style={{ backgroundColor: "#264653", aspectRatio: "16/9" }}
              >
                {/* Avatar placeholder with sound waves */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
                    🧑‍💼
                  </div>
                  {/* Animated sound wave bars */}
                  <div className="flex items-end gap-1">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <motion.div
                        key={bar}
                        className="w-1.5 rounded-full bg-white/50"
                        animate={{ height: [8, 20 + bar * 4, 8] }}
                        transition={{ duration: 1 + bar * 0.15, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Overlay banner */}
                <div className="absolute inset-x-0 bottom-0 bg-black/50 py-3 text-center">
                  <span className="text-sm font-semibold text-white">
                    {t("Coming Soon — Full Video Experience", "Próximamente — Experiencia de Video Completa")}
                  </span>
                </div>
              </div>

              {/* Video controls */}
              <div className="flex flex-col items-center gap-4 bg-background px-6 py-5">
                <div className="flex items-center gap-3">
                  <button className="rounded-full bg-muted p-2.5 text-muted-foreground" disabled>
                    <MicOff size={18} />
                  </button>
                  <button className="rounded-full bg-muted p-2.5 text-muted-foreground" disabled>
                    <VideoOff size={18} />
                  </button>
                  <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    <Globe size={14} />
                    English / Español
                  </div>
                </div>
                <Button disabled variant="secondary" className="w-full max-w-xs opacity-50">
                  {t("Start Conversation", "Iniciar Conversación")}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {t(
                    "Our AI video assistant will guide you step by step. Available in English and Spanish. Currently in development.",
                    "Nuestro asistente de video con IA te guiará paso a paso. Disponible en inglés y español. Actualmente en desarrollo."
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIAssistant;
