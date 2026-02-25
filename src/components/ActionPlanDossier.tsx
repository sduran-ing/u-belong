import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download, Mail, Phone, ExternalLink, Lock } from "lucide-react";

const STEPS = [
  {
    num: 1,
    title: "Secure Your Safety",
    titleEs: "Asegura Tu Seguridad",
    timeframe: "Immediately",
    timeframeEs: "Inmediatamente",
    timeColor: "#D64045",
    desc: "If you feel unsafe, remove yourself from the situation. Contact police (911) if in immediate danger. Crisis Line: 988.",
    descEs: "Si no te sientes seguro, aléjate de la situación. Contacta a la policía (911) si estás en peligro inmediato. Línea de crisis: 988.",
  },
  {
    num: 2,
    title: "Document Everything",
    titleEs: "Documenta Todo",
    timeframe: "Within 24 hours",
    timeframeEs: "Dentro de 24 horas",
    timeColor: "#E9C46A",
    desc: "Write down what happened: dates, times, locations, what was said, witnesses. Save texts, emails, screenshots. This will be critical evidence.",
    descEs: "Escribe lo que sucedió: fechas, horas, lugares, lo que se dijo, testigos. Guarda textos, correos, capturas. Será evidencia fundamental.",
  },
  {
    num: 3,
    title: "Report Internally",
    titleEs: "Reporta Internamente",
    timeframe: "Within 48 hours",
    timeframeEs: "Dentro de 48 horas",
    timeColor: "#E9C46A",
    desc: "File a formal written complaint with HR. Keep copies of everything. If no HR, email your supervisor so there is a dated record.",
    descEs: "Presenta una queja formal por escrito a Recursos Humanos. Guarda copias de todo. Si no hay RH, envía un correo a tu supervisor para tener un registro con fecha.",
  },
  {
    num: 4,
    title: "File a Formal Complaint",
    titleEs: "Presenta una Queja Formal",
    timeframe: "Within 2 weeks",
    timeframeEs: "Dentro de 2 semanas",
    timeColor: "#2A9D8F",
    desc: "File with the Ontario Human Rights Tribunal (HRTO) online at sjto.gov.on.ca or call 1-866-598-0322. It's free. You have 1 year from the incident.",
    descEs: "Presenta ante el Tribunal de Derechos Humanos de Ontario (HRTO) en sjto.gov.on.ca o llama al 1-866-598-0322. Es gratuito. Tienes 1 año desde el incidente.",
    link: { label: "File with HRTO →", labelEs: "Presentar ante HRTO →", url: "https://sjto.gov.on.ca" },
  },
  {
    num: 5,
    title: "Get Legal Support",
    titleEs: "Obtén Apoyo Legal",
    timeframe: "Within 2 weeks",
    timeframeEs: "Dentro de 2 semanas",
    timeColor: "#2A9D8F",
    desc: "Contact a community legal clinic for free advice and representation.",
    descEs: "Contacta una clínica legal comunitaria para asesoría y representación gratuita.",
    contacts: [
      { name: "Parkdale Community Legal Services", phone: "(416) 531-2411" },
      { name: "Workers' Action Centre", phone: "(416) 531-0778" },
      { name: "Migrant Workers Alliance", phone: "(416) 531-0778" },
    ],
  },
  {
    num: 6,
    title: "Follow Up & Track",
    titleEs: "Seguimiento y Registro",
    timeframe: "Ongoing",
    timeframeEs: "Continuo",
    timeColor: "#6BA368",
    desc: "Keep a log of all communications. HRTO acknowledges complaints within 2–4 weeks. Your legal clinic can help prepare for mediation or hearing.",
    descEs: "Mantén un registro de todas las comunicaciones. HRTO acusa recibo en 2–4 semanas. Tu clínica legal puede ayudarte a preparar la mediación o audiencia.",
  },
];

const ActionPlanDossier = () => {
  const { t } = useLanguage();

  const handleDownload = () => window.print();
  const handleEmail = () => {
    window.location.href = "mailto:?subject=My%20U%20Belong%20Action%20Plan&body=Visit%20U%20Belong%20to%20generate%20your%20personalized%20action%20plan.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 max-w-3xl rounded-2xl border bg-card p-6 shadow-xl md:p-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="mb-3 text-2xl font-extrabold md:text-3xl">
          {t("Your Personalized Action Plan", "Tu Plan de Acción Personalizado")}
        </h3>
        <div className="mb-3 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: "#E9C46A", color: "#1a1a1a" }}
          >
            🟡 {t("Active Situation", "Situación Activa")}
          </span>
          <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {t("Workplace Discrimination — Immigration Status", "Discriminación Laboral — Estatus Migratorio")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Ontario Human Rights Code, s. 5(1) • Canada Labour Code, s. 247.1-247.4
        </p>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 border-l-2 border-primary/30 pl-8">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            className="relative mb-8 last:mb-0"
          >
            {/* Node */}
            <div className="absolute -left-[2.55rem] flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {step.num}
            </div>

            {/* Content */}
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h4 className="font-bold">{t(step.title, step.titleEs)}</h4>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: step.timeColor }}
                >
                  ⏱️ {t(step.timeframe, step.timeframeEs)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(step.desc, step.descEs)}
              </p>

              {step.link && (
                <a
                  href={step.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: "#E76F51" }}
                >
                  {t(step.link.label, step.link.labelEs)} <ExternalLink size={12} />
                </a>
              )}

              {step.contacts && (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {step.contacts.map((c) => (
                    <a
                      key={c.phone}
                      href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                      className="flex flex-col rounded-lg border bg-background p-3 text-xs transition-colors hover:border-primary"
                    >
                      <span className="font-semibold">{c.name}</span>
                      <span className="mt-1 text-primary">{c.phone}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 border-t pt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Download size={16} /> {t("Download as PDF", "Descargar como PDF")}
          </button>
          <button
            onClick={handleEmail}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Mail size={16} /> {t("Email This Plan", "Enviar por Correo")}
          </button>
          <a
            href="tel:18665980322"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: "#E76F51" }}
          >
            <Phone size={16} /> {t("Call for Help Now", "Llama por Ayuda Ahora")}
          </a>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Lock size={12} />
          {t(
            "This plan is not stored. We do not save any personal information.",
            "Este plan no se almacena. No guardamos ninguna información personal."
          )}
        </p>
      </div>
    </motion.div>
  );
};

export default ActionPlanDossier;
