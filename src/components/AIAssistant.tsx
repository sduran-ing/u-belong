import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Video, Send, Mic, MicOff, VideoOff, Globe, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionPlanDossier from "@/components/ActionPlanDossier";

interface Message {
  role: "assistant" | "user";
  text: string;
  followUpOptions?: string[];
}

const WELCOME_MESSAGE =
  "👋 Hola! I'm your U Belong assistant. Tell me about your situation and I'll help you understand your rights and create an action plan. You can write in English or Spanish.";

const CHIPS = [
  "My employer is threatening to cancel my work permit",
  "I was denied housing because of my accent",
  "I need accessibility accommodations at work",
];

// Follow-up question trees based on detected topic
interface FollowUpTree {
  detect: (text: string) => boolean;
  questions: { question: string; questionEs: string; options: string[] }[];
}

const FOLLOW_UP_TREES: FollowUpTree[] = [
  {
    detect: (text) => /work\s?permit|employer.*threaten|fired|terminat|dismiss|despid/i.test(text),
    questions: [
      {
        question: "What type of work permit do you have?",
        questionEs: "¿Qué tipo de permiso de trabajo tienes?",
        options: ["Open work permit", "Employer-specific (closed) work permit", "I'm not sure", "I don't have one"],
      },
      {
        question: "Has your employer made the threat in writing (email, text) or only verbally?",
        questionEs: "¿Tu empleador hizo la amenaza por escrito (correo, texto) o solo verbalmente?",
        options: ["In writing — I have proof", "Verbally only", "Both", "Through a third party"],
      },
      {
        question: "How long have you worked for this employer?",
        questionEs: "¿Cuánto tiempo has trabajado para este empleador?",
        options: ["Less than 3 months", "3–12 months", "1–3 years", "More than 3 years"],
      },
    ],
  },
  {
    detect: (text) => /housing|rent|landlord|evict|denied.*apart|accent.*hous|vivienda|arrendador|desaloj/i.test(text),
    questions: [
      {
        question: "At what stage did this happen?",
        questionEs: "¿En qué etapa ocurrió esto?",
        options: ["Applying / viewing a rental", "During tenancy", "Eviction or threat of eviction"],
      },
      {
        question: "Do you have evidence of the discrimination (messages, recordings, witnesses)?",
        questionEs: "¿Tienes evidencia de la discriminación (mensajes, grabaciones, testigos)?",
        options: ["Yes, written evidence", "Yes, witnesses", "No evidence yet", "I'm not sure what counts"],
      },
      {
        question: "Which province are you in?",
        questionEs: "¿En qué provincia estás?",
        options: ["Ontario", "British Columbia", "Quebec", "Other"],
      },
    ],
  },
  {
    detect: (text) => /accommodat|disabilit|accessib|barrier|wheelchair|mental health|discapacid|accesib/i.test(text),
    questions: [
      {
        question: "Where do you need the accommodation?",
        questionEs: "¿Dónde necesitas la adaptación?",
        options: ["At work", "At school / university", "Accessing healthcare", "Public spaces / transport"],
      },
      {
        question: "Have you submitted a formal request?",
        questionEs: "¿Has enviado una solicitud formal?",
        options: ["Yes, and it was denied", "Yes, waiting for response", "No, I don't know how", "No, I'm afraid of consequences"],
      },
      {
        question: "Does your employer/institution know about your needs?",
        questionEs: "¿Tu empleador/institución sabe sobre tus necesidades?",
        options: ["Yes, fully aware", "Partially — they know some", "No, I haven't disclosed", "They found out without my consent"],
      },
    ],
  },
  {
    detect: (text) => /discriminat|race|racism|ethnic|origin|language|religion|discrimin/i.test(text),
    questions: [
      {
        question: "Where did this discrimination happen?",
        questionEs: "¿Dónde ocurrió esta discriminación?",
        options: ["At work", "Housing / rental", "Accessing a service", "In public / social setting"],
      },
      {
        question: "Was this a single incident or ongoing?",
        questionEs: "¿Fue un incidente único o continuo?",
        options: ["Single incident", "Ongoing / repeated", "Escalating pattern", "I'm not sure"],
      },
      {
        question: "Have you reported it to anyone?",
        questionEs: "¿Lo has reportado a alguien?",
        options: ["No, this is my first step", "Yes, to HR or management", "Yes, to police", "Yes, to a legal clinic"],
      },
    ],
  },
  {
    // Fallback — general
    detect: () => true,
    questions: [
      {
        question: "What area does your situation relate to?",
        questionEs: "¿A qué área se relaciona tu situación?",
        options: ["Workplace rights", "Housing", "Discrimination", "Disability / accessibility", "Other"],
      },
      {
        question: "How urgent is your situation?",
        questionEs: "¿Qué tan urgente es tu situación?",
        options: ["I want to understand my rights", "I'm currently experiencing this", "I need help immediately"],
      },
      {
        question: "Have you taken any steps so far?",
        questionEs: "¿Has tomado alguna medida hasta ahora?",
        options: ["No, this is my first step", "I've spoken to someone", "I filed a complaint", "I contacted a lawyer"],
      },
    ],
  },
];

const buildContextualResponse = (userText: string, answers: string[]): string => {
  // Detect topic
  const isWorkPermit = /work\s?permit|employer.*threaten|fired|terminat|dismiss/i.test(userText);
  const isHousing = /housing|rent|landlord|evict|denied.*apart|accent.*hous/i.test(userText);
  const isDisability = /accommodat|disabilit|accessib|barrier/i.test(userText);

  if (isWorkPermit) {
    const permitType = answers[0] || "";
    const evidence = answers[1] || "";
    const duration = answers[2] || "";

    let response = "Based on what you've shared, here's my assessment:\n\n";
    response += "**Situation:** Workplace intimidation — immigration status\n\n";

    if (permitType.includes("Employer-specific")) {
      response += "⚠️ With an employer-specific work permit, you have additional vulnerability but also specific protections. Your employer **cannot** cancel your work permit — only IRCC can do that.\n\n";
    } else if (permitType.includes("Open")) {
      response += "With an open work permit, you have the freedom to change employers. Your employer has **no power** over your immigration status.\n\n";
    }

    response += "**Next steps:**\n";
    response += "1. ";
    if (evidence.includes("writing")) {
      response += "You have written proof — this is strong evidence. Save it in multiple places.\n";
    } else {
      response += "Start documenting immediately. Write down exactly what was said, when, and who witnessed it.\n";
    }

    if (duration.includes("3 years") || duration.includes("1–3")) {
      response += "2. With your length of employment, you may be entitled to significant notice or severance if terminated.\n";
    } else {
      response += "2. File a complaint with Employment Standards and the Migrant Workers Alliance — (416) 531-0778\n";
    }

    response += "3. Contact the Workers' Action Centre for free, confidential advice — (416) 531-0778\n";
    response += "4. Consider filing a human rights complaint (free, 1-year deadline)\n\n";
    response += "Click below to generate your full personalized action plan with timelines and contacts.";
    return response;
  }

  if (isHousing) {
    const stage = answers[0] || "";
    const evidence = answers[1] || "";
    const province = answers[2] || "";

    let response = "Based on your answers, here's my assessment:\n\n";
    response += "**Situation:** Housing discrimination\n\n";

    if (stage.includes("Eviction")) {
      response += "⚠️ If you're facing eviction, your landlord **must** follow the legal process through the Landlord and Tenant Board. Illegal eviction is a serious offence.\n\n";
    } else if (stage.includes("Applying")) {
      response += "Refusing to rent based on accent, origin, or ethnicity violates your Human Rights Code. Landlords cannot screen tenants based on protected grounds.\n\n";
    }

    response += "**Next steps:**\n";
    response += evidence.includes("written") || evidence.includes("witnesses")
      ? "1. Great — keep all your evidence organized with dates and context.\n"
      : "1. Start gathering evidence: save all messages, take notes of conversations, and identify potential witnesses.\n";

    if (province === "Ontario") {
      response += "2. File a complaint with the Ontario Human Rights Tribunal (HRTO) — free, online at sjto.gov.on.ca\n";
      response += "3. Contact the Centre for Equality Rights in Accommodation (CERA) — (416) 944-0087\n";
    } else {
      response += "2. File a complaint with your provincial Human Rights Commission (free)\n";
      response += "3. Contact a community legal clinic for housing rights support\n";
    }

    response += "\nClick below to generate your full action plan.";
    return response;
  }

  if (isDisability) {
    const where = answers[0] || "";
    const request = answers[1] || "";

    let response = "Based on your answers, here's my assessment:\n\n";
    response += `**Situation:** Accessibility barrier — ${where.toLowerCase()}\n\n`;

    if (request.includes("denied")) {
      response += "⚠️ Your accommodation was formally denied. Under Canadian law, the institution **must prove undue hardship** — the burden of proof is on them, not you.\n\n";
      response += "**Next steps:**\n";
      response += "1. Request the reason for denial **in writing**\n";
      response += "2. You do NOT need to share your full diagnosis — only functional limitations\n";
    } else if (request.includes("don't know how")) {
      response += "You have the right to request accommodation. Here's how:\n\n";
      response += "**Next steps:**\n";
      response += "1. Write a formal request letter/email describing barriers and needed accommodations\n";
      response += "2. Include supporting documentation from your healthcare provider (functional limitations, not diagnosis)\n";
    } else {
      response += "**Next steps:**\n";
      response += "1. Document all interactions and barriers you're experiencing\n";
    }

    response += "\n3. Contact your provincial Human Rights Commission if accommodation is refused\n";
    response += "4. Reach out to a disability rights organization for free advocacy support\n\n";
    response += "Click below to generate your full action plan.";
    return response;
  }

  // Generic but contextual
  let response = "Thank you for sharing those details. Based on your answers:\n\n";
  const area = answers[0] || "";
  const urgency = answers[1] || "";
  const prior = answers[2] || "";

  response += `**Area:** ${area}\n`;
  if (urgency.includes("immediately")) {
    response += "**Priority:** 🔴 Urgent — your safety comes first\n\n";
    response += "If you're in danger, call 911. For crisis support, call/text 988.\n\n";
  } else if (urgency.includes("currently")) {
    response += "**Priority:** 🟡 Active situation — timely action needed\n\n";
  } else {
    response += "**Priority:** 🟢 Informational\n\n";
  }

  response += "**Next steps:**\n";
  if (prior.includes("first step")) {
    response += "1. Start documenting everything: dates, interactions, communications\n";
  } else {
    response += "1. Organize your existing documentation and any complaint records\n";
  }
  response += "2. File a complaint with the relevant authority (free)\n";
  response += "3. Contact a community legal clinic for free guidance\n\n";
  response += "Click below to generate your full personalized action plan.";
  return response;
};

const AIAssistant = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"chat" | "video">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [chipsUsed, setChipsUsed] = useState<Set<string>>(new Set());
  const [dossierState, setDossierState] = useState<"hidden" | "loading" | "visible">("hidden");
  const dossierRef = useRef<HTMLDivElement>(null);

  // Follow-up tracking
  const [pendingFollowUp, setPendingFollowUp] = useState<{
    tree: FollowUpTree;
    currentQuestion: number;
    answers: string[];
    originalText: string;
  } | null>(null);
  const [contextGathered, setContextGathered] = useState(false);

  const handleInitialMessage = (userText: string) => {
    // Find matching follow-up tree
    const tree = FOLLOW_UP_TREES.find((t) => t.detect(userText))!;
    const firstQ = tree.questions[0];

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      {
        role: "assistant",
        text: t(
          `I want to understand your situation better so I can give you the right guidance. Let me ask a few quick questions:\n\n**${firstQ.question}**`,
          `Quiero entender mejor tu situación para darte la orientación correcta. Déjame hacerte algunas preguntas rápidas:\n\n**${firstQ.questionEs}**`
        ),
        followUpOptions: firstQ.options,
      },
    ]);

    setPendingFollowUp({
      tree,
      currentQuestion: 0,
      answers: [],
      originalText: userText,
    });
  };

  const handleFollowUpAnswer = (answer: string) => {
    if (!pendingFollowUp) return;

    const { tree, currentQuestion, answers, originalText } = pendingFollowUp;
    const newAnswers = [...answers, answer];
    const nextIndex = currentQuestion + 1;

    if (nextIndex < tree.questions.length) {
      // Ask next question
      const nextQ = tree.questions[nextIndex];
      setMessages((prev) => [
        ...prev,
        { role: "user", text: answer },
        {
          role: "assistant",
          text: t(`**${nextQ.question}**`, `**${nextQ.questionEs}**`),
          followUpOptions: nextQ.options,
        },
      ]);
      setPendingFollowUp({ ...pendingFollowUp, currentQuestion: nextIndex, answers: newAnswers });
    } else {
      // All questions answered — provide contextual response
      const contextualResponse = buildContextualResponse(originalText, newAnswers);
      setMessages((prev) => [
        ...prev,
        { role: "user", text: answer },
        { role: "assistant", text: contextualResponse },
      ]);
      setPendingFollowUp(null);
      setContextGathered(true);
    }
  };

  const handleChip = (chip: string) => {
    setChipsUsed((prev) => new Set(prev).add(chip));
    handleInitialMessage(chip);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    if (pendingFollowUp) {
      // Treat typed input as a follow-up answer
      handleFollowUpAnswer(text);
    } else if (!contextGathered) {
      handleInitialMessage(text);
    } else {
      // After context gathered, simple exchange
      setMessages((prev) => [
        ...prev,
        { role: "user", text },
        { role: "assistant", text: "Thank you for the additional context. You can generate your action plan below, or ask me anything else about your rights." },
      ]);
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const numbered = bold.replace(/^(\d+)\.\s/, '<span class="font-semibold">$1.</span> ');
      return (
        <span key={i} dangerouslySetInnerHTML={{ __html: numbered }} className="block" />
      );
    });
  };

  // Check if the last message has follow-up options
  const lastMessage = messages[messages.length - 1];
  const showFollowUpOptions = lastMessage?.role === "assistant" && lastMessage.followUpOptions;
  const showActionPlanButton = contextGathered && dossierState === "hidden";

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
                  <div key={i}>
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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

                    {/* Follow-up option buttons */}
                    {msg.followUpOptions && i === messages.length - 1 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.followUpOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleFollowUpAnswer(opt)}
                            className="rounded-full border border-primary bg-background px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Action plan button — only after context is gathered */}
                {showActionPlanButton && (
                  <div className="flex justify-start">
                    <button
                      className="mt-1 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: "#E76F51" }}
                      onClick={() => {
                        setDossierState("loading");
                        setTimeout(() => {
                          setDossierState("visible");
                          setTimeout(() => dossierRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
                        }, 2500);
                      }}
                    >
                      {t("Generate My Action Plan", "Generar Mi Plan de Acción")} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick-start chips */}
              {!pendingFollowUp && !contextGathered && CHIPS.filter((c) => !chipsUsed.has(c)).length > 0 && (
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
                  placeholder={
                    pendingFollowUp
                      ? t("Type your answer or click an option above...", "Escribe tu respuesta o haz clic en una opción arriba...")
                      : t("Describe your situation...", "Describe tu situación...")
                  }
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
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
                    🧑‍💼
                  </div>
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

                <div className="absolute inset-x-0 bottom-0 bg-black/50 py-3 text-center">
                  <span className="text-sm font-semibold text-white">
                    {t("Coming Soon — Full Video Experience", "Próximamente — Experiencia de Video Completa")}
                  </span>
                </div>
              </div>

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

        {/* Loading spinner */}
        <AnimatePresence>
          {dossierState === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-center gap-3 py-8"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                {t("Analyzing your situation...", "Analizando tu situación...")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dossier */}
        <div ref={dossierRef}>
          {dossierState === "visible" && <ActionPlanDossier />}
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;
