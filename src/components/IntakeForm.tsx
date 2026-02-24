import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, FileText, Phone, Download, Mail, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const provinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
  "Quebec", "Saskatchewan", "Yukon",
];

const categories = [
  { en: "Discrimination (race, ethnicity, origin, language)", es: "Discriminación (raza, etnia, origen, idioma)" },
  { en: "Workplace issue (unfair treatment, unsafe conditions, wage theft)", es: "Problema laboral (trato injusto, condiciones inseguras, robo de salario)" },
  { en: "Disability or accessibility barrier", es: "Discapacidad o barrera de accesibilidad" },
  { en: "Housing discrimination", es: "Discriminación en vivienda" },
  { en: "Access to services (healthcare, education, government)", es: "Acceso a servicios (salud, educación, gobierno)" },
  { en: "Other", es: "Otro" },
];

const residenceOptions = [
  { en: "Permanent Resident", es: "Residente Permanente" },
  { en: "Refugee Claimant", es: "Solicitante de Refugio" },
  { en: "Work Permit Holder", es: "Titular de Permiso de Trabajo" },
  { en: "Student Visa", es: "Visa de Estudiante" },
  { en: "Canadian Citizen", es: "Ciudadano Canadiense" },
  { en: "Prefer Not to Say", es: "Prefiero No Decir" },
];

interface FormData {
  province: string;
  residenceStatus: string;
  categories: string[];
  severity: string;
  description: string;
}

const IntakeForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showDossier, setShowDossier] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    province: "",
    residenceStatus: "",
    categories: [],
    severity: "",
    description: "",
  });

  const totalSteps = 3;

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = () => {
    setShowDossier(true);
    toast({
      title: t("Your dossier is ready!", "¡Tu expediente está listo!"),
      description: t("Scroll down to view your action plan.", "Desplázate hacia abajo para ver tu plan de acción."),
    });
  };

  const canProceed = () => {
    if (step === 1) return formData.province && formData.residenceStatus;
    if (step === 2) return formData.categories.length > 0 && formData.severity;
    if (step === 3) return formData.description.trim().length > 10;
    return false;
  };

  if (showDossier) {
    return <ActionDossier formData={formData} onBack={() => setShowDossier(false)} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border bg-card p-6 shadow-md md:p-8">
        <h2 className="mb-2 text-2xl font-bold">{t("Scope Your Situation", "Define Tu Situación")}</h2>

        {/* Progress bar */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
            </div>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            {step}/{totalSteps}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Province/Territory", "Provincia/Territorio")}</label>
                <div className="relative">
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full appearance-none rounded-xl border bg-background px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t("Select your province", "Selecciona tu provincia")}</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Residence Status", "Estatus de Residencia")}</label>
                <div className="space-y-2">
                  {residenceOptions.map((opt) => (
                    <label key={opt.en} className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-muted">
                      <input
                        type="radio"
                        name="residenceStatus"
                        value={opt.en}
                        checked={formData.residenceStatus === opt.en}
                        onChange={(e) => setFormData({ ...formData, residenceStatus: e.target.value })}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">{t(opt.en, opt.es)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock size={14} />
                {t("Your information is confidential and never stored.", "Tu información es confidencial y nunca se almacena.")}
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Type of Situation", "Tipo de Situación")}</label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.en} className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(cat.en)}
                        onChange={() => handleCategoryToggle(cat.en)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">{t(cat.en, cat.es)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t("How urgent is this?", "¿Qué tan urgente es esto?")}</label>
                <div className="space-y-2">
                  {[
                    { value: "info", emoji: "🟢", en: "I want to understand my rights", es: "Quiero entender mis derechos" },
                    { value: "active", emoji: "🟡", en: "I'm currently experiencing this", es: "Estoy experimentando esto actualmente" },
                    { value: "urgent", emoji: "🔴", en: "I need help immediately — I feel unsafe", es: "Necesito ayuda de inmediato — me siento inseguro/a" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-muted">
                      <input
                        type="radio"
                        name="severity"
                        value={opt.value}
                        checked={formData.severity === opt.value}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">{opt.emoji} {t(opt.en, opt.es)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Tell Us What Happened", "Cuéntanos Qué Pasó")}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t(
                    "For example: My employer refused to give me time off for a medical appointment and threatened to fire me...",
                    "Por ejemplo: Mi empleador se negó a darme tiempo libre para una cita médica y amenazó con despedirme..."
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("The more detail you provide, the better we can help.", "Cuanto más detalle proporciones, mejor podremos ayudarte.")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
              {t("Back", "Atrás")}
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("Next", "Siguiente")}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("Get My Dossier", "Obtener Mi Expediente")}
            </button>
          )}
        </div>
      </div>

      {/* Voice assistant placeholder */}
      <div className="mt-8 rounded-xl border-2 border-dashed border-muted p-8 text-center">
        <Mic className="mx-auto mb-3 text-muted-foreground" size={40} />
        <h3 className="text-lg font-semibold text-muted-foreground">
          🎙️ {t("Voice Assistant — Coming Soon", "Asistente de Voz — Próximamente")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "Soon you'll be able to describe your situation by speaking, and our AI assistant will guide you in real time.",
            "Pronto podrás describir tu situación hablando, y nuestro asistente de IA te guiará en tiempo real."
          )}
        </p>
      </div>
    </div>
  );
};

// Action Dossier Component
const ActionDossier = ({ formData, onBack }: { formData: FormData; onBack: () => void }) => {
  const { t } = useLanguage();

  const getCaseDiagnosis = () => {
    if (formData.categories.includes("Discrimination (race, ethnicity, origin, language)")) {
      return {
        type: t("Workplace Discrimination based on National Origin", "Discriminación Laboral basada en Origen Nacional"),
        legislation: formData.province === "Ontario"
          ? "Ontario Human Rights Code, Section 5"
          : formData.province === "British Columbia"
          ? "BC Human Rights Code, Section 13"
          : "Canadian Human Rights Act, Section 3",
      };
    }
    if (formData.categories.includes("Workplace issue (unfair treatment, unsafe conditions, wage theft)")) {
      return {
        type: t("Employment Standards Violation", "Violación de Normas de Empleo"),
        legislation: formData.province === "Ontario"
          ? "Ontario Employment Standards Act, 2000"
          : "Canada Labour Code, Part III",
      };
    }
    return {
      type: t("Human Rights Concern", "Asunto de Derechos Humanos"),
      legislation: "Canadian Human Rights Act",
    };
  };

  const diagnosis = getCaseDiagnosis();

  const severityConfig = {
    info: { color: "bg-success", label: t("Informational", "Informativo"), note: t("Take your time to understand your options.", "Toma tu tiempo para entender tus opciones.") },
    active: { color: "bg-secondary", label: t("Active Situation", "Situación Activa"), note: t("This situation requires timely action. You have 1 year from the incident to file a complaint.", "Esta situación requiere acción oportuna. Tienes 1 año desde el incidente para presentar una queja.") },
    urgent: { color: "bg-destructive", label: t("Urgent", "Urgente"), note: t("Please reach out for help immediately. Your safety is the priority.", "Por favor busca ayuda de inmediato. Tu seguridad es la prioridad.") },
  };

  const sev = severityConfig[formData.severity as keyof typeof severityConfig] || severityConfig.info;

  const steps = [
    { icon: "📝", title: t("Document everything", "Documenta todo"), desc: t("Save emails, texts, take notes with dates and names of witnesses.", "Guarda correos, mensajes, toma notas con fechas y nombres de testigos.") },
    { icon: "📋", title: t("File a complaint", "Presenta una queja"), desc: t(`File with the ${formData.province || "Provincial"} Human Rights Commission or Tribunal.`, `Presenta ante la Comisión o Tribunal de Derechos Humanos de ${formData.province || "tu provincia"}.`) },
    { icon: "📞", title: t("Contact a legal clinic", "Contacta una clínica legal"), desc: t("Reach out to a community legal clinic for free help.", "Comunícate con una clínica legal comunitaria para ayuda gratuita.") },
    { icon: "⏰", title: t("Follow up within 2 weeks", "Da seguimiento en 2 semanas"), desc: t("Keep records of all communications and follow up regularly.", "Mantén registros de todas las comunicaciones y da seguimiento regularmente.") },
  ];

  const contacts = [
    { name: t("Ontario Human Rights Tribunal", "Tribunal de Derechos Humanos de Ontario"), phone: "1-866-598-0322", url: "http://www.hrto.ca", desc: t("File and track human rights complaints", "Presenta y da seguimiento a quejas de derechos humanos") },
    { name: t("Community Legal Education Ontario", "Educación Legal Comunitaria de Ontario"), phone: "", url: "https://cleo.on.ca", desc: t("Free legal information in multiple languages", "Información legal gratuita en múltiples idiomas") },
    { name: t("Centre for Spanish Speaking Peoples", "Centro para Personas de Habla Hispana"), phone: "416-533-8545", url: "", desc: t("Settlement, legal, and employment services in Spanish", "Servicios de asentamiento, legales y de empleo en español") },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl space-y-6">
      <button onClick={onBack} className="mb-2 text-sm font-medium text-primary hover:underline">
        ← {t("Back to form", "Volver al formulario")}
      </button>

      <h2 className="text-2xl font-bold">{t("Your Action Dossier", "Tu Expediente de Acción")}</h2>

      {/* Case Diagnosis */}
      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">📋 {t("Case Diagnosis", "Diagnóstico del Caso")}</h3>
        <p className="mb-2 text-sm text-muted-foreground">{t("Based on what you described, this appears to be:", "Basado en lo que describiste, esto parece ser:")}</p>
        <span className="mb-2 inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{diagnosis.type}</span>
        <p className="text-sm text-muted-foreground">{t("Relevant legislation:", "Legislación relevante:")} <strong>{diagnosis.legislation}</strong></p>
      </div>

      {/* Severity */}
      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">⚡ {t("Severity & Priority", "Severidad y Prioridad")}</h3>
        <div className="mb-2 flex items-center gap-3">
          <span className={`inline-block h-4 w-4 rounded-full ${sev.color}`} />
          <span className="font-semibold">{sev.label}</span>
        </div>
        <p className="text-sm text-muted-foreground">{sev.note}</p>
      </div>

      {/* Action Plan */}
      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">🗺️ {t("Your Action Plan", "Tu Plan de Acción")}</h3>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
                {i < steps.length - 1 && <div className="mt-1 h-full w-0.5 bg-border" />}
              </div>
              <div className="pb-4">
                <p className="font-semibold">{s.icon} {s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Contacts */}
      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">📞 {t("Key Contacts", "Contactos Clave")}</h3>
        <div className="space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="rounded-xl border p-4 transition-colors hover:bg-muted">
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Phone size={14} /> {c.phone}
                  </a>
                )}
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    🌐 {t("Website", "Sitio Web")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download/Share */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Download size={16} /> {t("Download as PDF", "Descargar como PDF")}
        </button>
        <button className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
          <Mail size={16} /> {t("Share via Email", "Compartir por Email")}
        </button>
      </div>
    </motion.div>
  );
};

export default IntakeForm;
