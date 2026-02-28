import { useState, useMemo } from "react";
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

// Dynamic follow-up questions based on selected categories
interface FollowUpQuestion {
  id: string;
  en: string;
  es: string;
  type: "radio" | "text";
  options?: { en: string; es: string }[];
}

const getFollowUpQuestions = (selectedCategories: string[], severity: string): FollowUpQuestion[] => {
  const questions: FollowUpQuestion[] = [];

  if (selectedCategories.includes("Discrimination (race, ethnicity, origin, language)")) {
    questions.push({
      id: "discrimination_context",
      en: "Where did the discrimination occur?",
      es: "¿Dónde ocurrió la discriminación?",
      type: "radio",
      options: [
        { en: "At work", es: "En el trabajo" },
        { en: "While looking for housing", es: "Buscando vivienda" },
        { en: "Accessing a service (hospital, school, government)", es: "Accediendo a un servicio (hospital, escuela, gobierno)" },
        { en: "In public / social setting", es: "En público / entorno social" },
      ],
    });
    questions.push({
      id: "discrimination_basis",
      en: "What do you believe the discrimination was based on?",
      es: "¿En qué crees que se basó la discriminación?",
      type: "radio",
      options: [
        { en: "Race or skin color", es: "Raza o color de piel" },
        { en: "Ethnic origin or nationality", es: "Origen étnico o nacionalidad" },
        { en: "Language or accent", es: "Idioma o acento" },
        { en: "Religion", es: "Religión" },
        { en: "Multiple / not sure", es: "Múltiple / no estoy seguro" },
      ],
    });
  }

  if (selectedCategories.includes("Workplace issue (unfair treatment, unsafe conditions, wage theft)")) {
    questions.push({
      id: "workplace_type",
      en: "What type of workplace issue are you facing?",
      es: "¿Qué tipo de problema laboral enfrentas?",
      type: "radio",
      options: [
        { en: "Unpaid wages or overtime", es: "Salarios o horas extras no pagadas" },
        { en: "Wrongful dismissal or threats of firing", es: "Despido injustificado o amenazas de despido" },
        { en: "Unsafe working conditions", es: "Condiciones de trabajo inseguras" },
        { en: "Harassment or bullying by employer", es: "Acoso o intimidación por el empleador" },
        { en: "Denied breaks, vacation, or sick leave", es: "Descansos, vacaciones o licencia por enfermedad denegados" },
      ],
    });
    questions.push({
      id: "workplace_contract",
      en: "Do you have a written employment contract?",
      es: "¿Tienes un contrato de empleo por escrito?",
      type: "radio",
      options: [
        { en: "Yes", es: "Sí" },
        { en: "No, verbal agreement only", es: "No, solo acuerdo verbal" },
        { en: "I'm not sure", es: "No estoy seguro" },
      ],
    });
  }

  if (selectedCategories.includes("Disability or accessibility barrier")) {
    questions.push({
      id: "disability_where",
      en: "Where are you experiencing the accessibility barrier?",
      es: "¿Dónde estás experimentando la barrera de accesibilidad?",
      type: "radio",
      options: [
        { en: "At work", es: "En el trabajo" },
        { en: "At school or university", es: "En la escuela o universidad" },
        { en: "Accessing healthcare", es: "Accediendo a atención médica" },
        { en: "Public spaces or transportation", es: "Espacios públicos o transporte" },
        { en: "Government services", es: "Servicios gubernamentales" },
      ],
    });
    questions.push({
      id: "disability_request",
      en: "Have you formally requested an accommodation?",
      es: "¿Has solicitado formalmente una adaptación?",
      type: "radio",
      options: [
        { en: "Yes, and it was denied", es: "Sí, y fue denegada" },
        { en: "Yes, but no response yet", es: "Sí, pero aún no hay respuesta" },
        { en: "No, I don't know how", es: "No, no sé cómo" },
        { en: "No, I'm afraid of consequences", es: "No, me temo las consecuencias" },
      ],
    });
  }

  if (selectedCategories.includes("Housing discrimination")) {
    questions.push({
      id: "housing_stage",
      en: "At what stage did the issue occur?",
      es: "¿En qué etapa ocurrió el problema?",
      type: "radio",
      options: [
        { en: "Applying / viewing a rental", es: "Solicitando / viendo un alquiler" },
        { en: "During the tenancy", es: "Durante el arrendamiento" },
        { en: "Eviction or threat of eviction", es: "Desalojo o amenaza de desalojo" },
      ],
    });
  }

  if (selectedCategories.includes("Access to services (healthcare, education, government)")) {
    questions.push({
      id: "service_type",
      en: "Which service were you trying to access?",
      es: "¿A qué servicio intentabas acceder?",
      type: "radio",
      options: [
        { en: "Healthcare (hospital, clinic, OHIP)", es: "Salud (hospital, clínica, OHIP)" },
        { en: "Education (school enrollment, ESL)", es: "Educación (inscripción escolar, ESL)" },
        { en: "Government ID or documents", es: "Identificación o documentos gubernamentales" },
        { en: "Social assistance or benefits", es: "Asistencia social o beneficios" },
      ],
    });
  }

  // Common follow-up for active/urgent situations
  if (severity === "active" || severity === "urgent") {
    questions.push({
      id: "timeline",
      en: "When did this situation start or most recently happen?",
      es: "¿Cuándo comenzó o ocurrió más recientemente esta situación?",
      type: "radio",
      options: [
        { en: "Today or this week", es: "Hoy o esta semana" },
        { en: "Within the last month", es: "Dentro del último mes" },
        { en: "1–6 months ago", es: "Hace 1–6 meses" },
        { en: "More than 6 months ago", es: "Hace más de 6 meses" },
      ],
    });
  }

  // Always ask about prior steps taken
  questions.push({
    id: "prior_action",
    en: "Have you taken any steps to address this so far?",
    es: "¿Has tomado alguna medida para abordar esto hasta ahora?",
    type: "radio",
    options: [
      { en: "No, this is my first step", es: "No, este es mi primer paso" },
      { en: "I've spoken to someone informally", es: "He hablado con alguien informalmente" },
      { en: "I filed a complaint or report", es: "Presenté una queja o informe" },
      { en: "I contacted a lawyer or legal clinic", es: "Contacté a un abogado o clínica legal" },
    ],
  });

  return questions;
};

interface FormData {
  province: string;
  residenceStatus: string;
  categories: string[];
  severity: string;
  description: string;
  followUpAnswers: Record<string, string>;
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
    followUpAnswers: {},
  });

  const totalSteps = 4;

  const followUpQuestions = useMemo(
    () => getFollowUpQuestions(formData.categories, formData.severity),
    [formData.categories, formData.severity]
  );

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleFollowUpAnswer = (questionId: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      followUpAnswers: { ...prev.followUpAnswers, [questionId]: answer },
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
    if (step === 1) return true;
    if (step === 2) return formData.categories.length > 0 && formData.severity;
    if (step === 3) return formData.description.trim().length > 10;
    if (step === 4) {
      // At least answer the required questions (all of them)
      const answered = Object.keys(formData.followUpAnswers).length;
      return answered >= followUpQuestions.length;
    }
    return false;
  };

  if (showDossier) {
    return <ActionDossier formData={formData} onBack={() => setShowDossier(false)} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border bg-card p-6 shadow-md md:p-8">
        <h2 className="mb-1 text-2xl font-bold">{t("Scope Your Situation", "Define Tu Situación")}</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          {t(
            "We ask this to show the right laws and local resources. Your info isn't stored.",
            "Preguntamos esto para mostrarte las leyes y recursos locales correctos. Tu información no se almacena."
          )}
        </p>

        {/* Progress bar */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
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

              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="text-xs font-medium text-muted-foreground underline hover:text-foreground"
              >
                {t("Skip for now", "Saltar por ahora")}
              </button>
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

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h3 className="mb-1 text-sm font-semibold">
                  {t("A few more questions to personalize your plan", "Algunas preguntas más para personalizar tu plan")}
                </h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  {t(
                    "These help us give you specific next steps, not generic advice.",
                    "Estas nos ayudan a darte pasos específicos, no consejos genéricos."
                  )}
                </p>
              </div>

              {followUpQuestions.map((q, qi) => (
                <div key={q.id}>
                  <label className="mb-2 block text-sm font-semibold">{t(q.en, q.es)}</label>
                  {q.type === "radio" && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <label key={opt.en} className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-muted">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.en}
                            checked={formData.followUpAnswers[q.id] === opt.en}
                            onChange={() => handleFollowUpAnswer(q.id, opt.en)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-sm">{t(opt.en, opt.es)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {qi < followUpQuestions.length - 1 && <div className="mt-4 border-t" />}
                </div>
              ))}
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

    </div>
  );
};

// Action Dossier Component
const ActionDossier = ({ formData, onBack }: { formData: FormData; onBack: () => void }) => {
  const { t } = useLanguage();

  const getCaseDiagnosis = () => {
    const answers = formData.followUpAnswers;

    if (formData.categories.includes("Discrimination (race, ethnicity, origin, language)")) {
      const context = answers.discrimination_context || "";
      const basis = answers.discrimination_basis || "";
      let type = t("Discrimination", "Discriminación");

      if (context === "At work") {
        type = t(`Workplace Discrimination based on ${basis || "Protected Ground"}`, `Discriminación Laboral basada en ${basis || "Motivo Protegido"}`);
      } else if (context === "While looking for housing") {
        type = t(`Housing Discrimination based on ${basis || "Protected Ground"}`, `Discriminación en Vivienda basada en ${basis || "Motivo Protegido"}`);
      } else if (context.includes("service")) {
        type = t(`Service Discrimination based on ${basis || "Protected Ground"}`, `Discriminación en Servicios basada en ${basis || "Motivo Protegido"}`);
      } else {
        type = t(`Discrimination based on ${basis || "Protected Ground"}`, `Discriminación basada en ${basis || "Motivo Protegido"}`);
      }

      return {
        type,
        legislation: formData.province === "Ontario"
          ? "Ontario Human Rights Code, Section 5"
          : formData.province === "British Columbia"
          ? "BC Human Rights Code, Section 13"
          : "Canadian Human Rights Act, Section 3",
      };
    }

    if (formData.categories.includes("Workplace issue (unfair treatment, unsafe conditions, wage theft)")) {
      const workType = answers.workplace_type || "";
      let type = t("Employment Standards Violation", "Violación de Normas de Empleo");
      let legislation = formData.province === "Ontario"
        ? "Ontario Employment Standards Act, 2000"
        : "Canada Labour Code, Part III";

      if (workType.includes("Unpaid wages")) {
        type = t("Wage Theft / Unpaid Compensation", "Robo de Salario / Compensación No Pagada");
      } else if (workType.includes("Wrongful dismissal")) {
        type = t("Wrongful Dismissal", "Despido Injustificado");
        if (formData.province === "Ontario") legislation = "Ontario Employment Standards Act, s. 54-62";
      } else if (workType.includes("Unsafe")) {
        type = t("Occupational Health & Safety Violation", "Violación de Salud y Seguridad Ocupacional");
        if (formData.province === "Ontario") legislation = "Ontario Occupational Health and Safety Act";
      } else if (workType.includes("Harassment")) {
        type = t("Workplace Harassment", "Acoso Laboral");
        if (formData.province === "Ontario") legislation = "Ontario Occupational Health and Safety Act, Part III.0.1";
      } else if (workType.includes("Denied breaks")) {
        type = t("Denial of Statutory Entitlements", "Negación de Derechos Estatutarios");
      }

      return { type, legislation };
    }

    if (formData.categories.includes("Disability or accessibility barrier")) {
      const where = answers.disability_where || "";
      const request = answers.disability_request || "";
      let type = t("Accessibility Barrier", "Barrera de Accesibilidad");

      if (where === "At work") {
        type = t("Workplace Accommodation Denial", "Denegación de Adaptación Laboral");
      } else if (where.includes("school")) {
        type = t("Educational Accommodation Barrier", "Barrera de Adaptación Educativa");
      } else if (where.includes("healthcare")) {
        type = t("Healthcare Accessibility Barrier", "Barrera de Accesibilidad en Salud");
      }

      if (request.includes("denied")) {
        type += t(" — Formal Request Denied", " — Solicitud Formal Denegada");
      }

      return {
        type,
        legislation: formData.province === "Ontario"
          ? "Accessibility for Ontarians with Disabilities Act (AODA) & Ontario Human Rights Code"
          : "Canadian Human Rights Act & Accessible Canada Act",
      };
    }

    if (formData.categories.includes("Housing discrimination")) {
      const stage = answers.housing_stage || "";
      let type = t("Housing Discrimination", "Discriminación en Vivienda");
      if (stage.includes("Eviction")) {
        type = t("Discriminatory Eviction / Threat", "Desalojo Discriminatorio / Amenaza");
      } else if (stage.includes("Applying")) {
        type = t("Discriminatory Rental Screening", "Selección Discriminatoria de Alquiler");
      }
      return {
        type,
        legislation: formData.province === "Ontario"
          ? "Ontario Human Rights Code, Section 2 & Residential Tenancies Act"
          : "Canadian Human Rights Act",
      };
    }

    if (formData.categories.includes("Access to services (healthcare, education, government)")) {
      const serviceType = answers.service_type || "";
      let type = t("Barrier to Public Services", "Barrera a Servicios Públicos");
      if (serviceType.includes("Healthcare")) type = t("Healthcare Access Barrier", "Barrera de Acceso a Salud");
      if (serviceType.includes("Education")) type = t("Education Access Barrier", "Barrera de Acceso a Educación");
      if (serviceType.includes("Government")) type = t("Government Services Access Barrier", "Barrera de Acceso a Servicios Gubernamentales");
      return { type, legislation: "Canadian Human Rights Act" };
    }

    return {
      type: t("Human Rights Concern", "Asunto de Derechos Humanos"),
      legislation: "Canadian Human Rights Act",
    };
  };

  const diagnosis = getCaseDiagnosis();
  const answers = formData.followUpAnswers;

  const severityConfig = {
    info: { color: "bg-success", label: t("Informational", "Informativo"), note: t("Take your time to understand your options.", "Toma tu tiempo para entender tus opciones.") },
    active: { color: "bg-secondary", label: t("Active Situation", "Situación Activa"), note: t("This situation requires timely action. You have 1 year from the incident to file a complaint.", "Esta situación requiere acción oportuna. Tienes 1 año desde el incidente para presentar una queja.") },
    urgent: { color: "bg-destructive", label: t("Urgent", "Urgente"), note: t("Please reach out for help immediately. Your safety is the priority.", "Por favor busca ayuda de inmediato. Tu seguridad es la prioridad.") },
  };

  const sev = severityConfig[formData.severity as keyof typeof severityConfig] || severityConfig.info;

  // Build contextual action steps based on follow-up answers
  const getContextualSteps = () => {
    const steps: { icon: string; title: string; desc: string }[] = [];

    // Urgent: safety first
    if (formData.severity === "urgent") {
      steps.push({
        icon: "🚨",
        title: t("Ensure your safety first", "Asegura tu seguridad primero"),
        desc: t("If you're in immediate danger, call 911. For crisis support, call/text 988.", "Si estás en peligro inmediato, llama al 911. Para apoyo en crisis, llama/envía mensaje al 988."),
      });
    }

    // Document based on prior action
    const priorAction = answers.prior_action || "";
    if (priorAction === "No, this is my first step") {
      steps.push({
        icon: "📝",
        title: t("Start documenting now", "Comienza a documentar ahora"),
        desc: t("Write down everything: dates, times, what was said, who was present. Save emails, texts, and screenshots. This will be your strongest evidence.", "Escribe todo: fechas, horas, lo que se dijo, quién estaba presente. Guarda correos, textos y capturas. Esta será tu evidencia más fuerte."),
      });
    } else if (priorAction.includes("complaint")) {
      steps.push({
        icon: "📋",
        title: t("Organize your existing documentation", "Organiza tu documentación existente"),
        desc: t("Gather all complaint records, responses, and correspondence in one place. Note any reference numbers.", "Reúne todos los registros de quejas, respuestas y correspondencia en un solo lugar. Anota los números de referencia."),
      });
    } else {
      steps.push({
        icon: "📝",
        title: t("Document everything", "Documenta todo"),
        desc: t("Save emails, texts, take notes with dates and names of witnesses.", "Guarda correos, mensajes, toma notas con fechas y nombres de testigos."),
      });
    }

    // Category-specific steps
    if (formData.categories.includes("Workplace issue (unfair treatment, unsafe conditions, wage theft)")) {
      const workType = answers.workplace_type || "";
      const hasContract = answers.workplace_contract || "";

      if (workType.includes("Unpaid wages")) {
        steps.push({
          icon: "💰",
          title: t("File a wage claim", "Presenta un reclamo salarial"),
          desc: t(`File a claim with the ${formData.province || "Provincial"} Ministry of Labour. Keep records of hours worked, pay stubs, and any agreements.`, `Presenta un reclamo ante el Ministerio de Trabajo de ${formData.province || "tu provincia"}. Guarda registros de horas trabajadas, recibos de pago y acuerdos.`),
        });
      } else if (workType.includes("Unsafe")) {
        steps.push({
          icon: "⚠️",
          title: t("Report to Occupational Health & Safety", "Reporta a Salud y Seguridad Ocupacional"),
          desc: t("You can file a complaint anonymously. Your employer cannot retaliate against you for reporting unsafe conditions.", "Puedes presentar una queja anónima. Tu empleador no puede tomar represalias contra ti por reportar condiciones inseguras."),
        });
      } else if (workType.includes("Wrongful dismissal")) {
        steps.push({
          icon: "⚖️",
          title: t("Review your termination rights", "Revisa tus derechos de terminación"),
          desc: hasContract.includes("Yes")
            ? t("Review your contract for termination clauses. You may be entitled to more than minimum notice.", "Revisa tu contrato para cláusulas de terminación. Podrías tener derecho a más que el preaviso mínimo.")
            : t("Even without a written contract, you have rights to notice or severance pay under employment standards.", "Incluso sin contrato escrito, tienes derechos a preaviso o indemnización bajo las normas de empleo."),
        });
      }
    }

    if (formData.categories.includes("Disability or accessibility barrier")) {
      const request = answers.disability_request || "";
      if (request.includes("denied")) {
        steps.push({
          icon: "📄",
          title: t("Request the denial in writing", "Solicita la denegación por escrito"),
          desc: t("Ask for the written reason for denial. Your employer/institution must explain why accommodation creates undue hardship.", "Pide la razón escrita de la denegación. Tu empleador/institución debe explicar por qué la adaptación crea dificultad excesiva."),
        });
      } else if (request.includes("don't know how")) {
        steps.push({
          icon: "✉️",
          title: t("Submit a formal accommodation request", "Presenta una solicitud formal de adaptación"),
          desc: t("Write a letter or email describing the barriers you face and the accommodations you need. You don't need to disclose your full diagnosis — only functional limitations.", "Escribe una carta o correo describiendo las barreras que enfrentas y las adaptaciones que necesitas. No necesitas revelar tu diagnóstico completo — solo las limitaciones funcionales."),
        });
      }
    }

    // Filing complaint step
    steps.push({
      icon: "📋",
      title: t("File a formal complaint", "Presenta una queja formal"),
      desc: t(`File with the ${formData.province || "Provincial"} Human Rights Commission or Tribunal. It's free and you have 1 year from the incident.`, `Presenta ante la Comisión o Tribunal de Derechos Humanos de ${formData.province || "tu provincia"}. Es gratuito y tienes 1 año desde el incidente.`),
    });

    // Legal help
    steps.push({
      icon: "📞",
      title: t("Contact a legal clinic", "Contacta una clínica legal"),
      desc: t("Reach out to a community legal clinic for free help. Many offer services in Spanish.", "Comunícate con una clínica legal comunitaria para ayuda gratuita. Muchas ofrecen servicios en español."),
    });

    // Timeline-based follow-up
    const timeline = answers.timeline || "";
    if (timeline.includes("6 months ago")) {
      steps.push({
        icon: "⏰",
        title: t("Act quickly — deadline approaching", "Actúa rápido — fecha límite acercándose"),
        desc: t("Most human rights complaints must be filed within 1 year. With 6+ months passed, prioritize filing soon.", "La mayoría de las quejas de derechos humanos deben presentarse dentro de 1 año. Con más de 6 meses pasados, prioriza presentarla pronto."),
      });
    } else {
      steps.push({
        icon: "⏰",
        title: t("Follow up within 2 weeks", "Da seguimiento en 2 semanas"),
        desc: t("Keep records of all communications and follow up regularly.", "Mantén registros de todas las comunicaciones y da seguimiento regularmente."),
      });
    }

    return steps;
  };

  const steps = getContextualSteps();

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
