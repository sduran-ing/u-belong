import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const WorkplaceRights = () => {
  const { t } = useLanguage();

  const rights = [
    { emoji: "💰", title: t("Fair Pay", "Pago Justo"), desc: t("You must be paid at least minimum wage. Overtime must be compensated.", "Debes recibir al menos el salario mínimo. Las horas extras deben ser compensadas.") },
    { emoji: "⏰", title: t("Working Hours", "Horas de Trabajo"), desc: t("Maximum hours, mandatory rest periods, and break times are regulated by law.", "Las horas máximas, períodos de descanso obligatorios y tiempos de pausa están regulados por ley.") },
    { emoji: "🛡️", title: t("Safe Workplace", "Lugar de Trabajo Seguro"), desc: t("Your employer must provide a safe environment. You can refuse unsafe work.", "Tu empleador debe proporcionar un ambiente seguro. Puedes rechazar trabajo inseguro.") },
    { emoji: "🚫", title: t("No Retaliation", "Sin Represalias"), desc: t("Your employer cannot punish you for reporting violations or filing complaints.", "Tu empleador no puede castigarte por reportar violaciones o presentar quejas.") },
    { emoji: "📋", title: t("Written Terms", "Términos Escritos"), desc: t("You have the right to a written employment agreement or contract.", "Tienes derecho a un acuerdo o contrato de empleo por escrito.") },
  ];

  const issues = [
    t("Being paid less than minimum wage or 'under the table'", "Recibir menos del salario mínimo o 'por debajo de la mesa'"),
    t("Being asked to work without proper breaks", "Que te pidan trabajar sin descansos adecuados"),
    t("Threats related to immigration status ('I'll cancel your work permit')", "Amenazas relacionadas con tu estatus migratorio ('Cancelaré tu permiso de trabajo')"),
    t("Unsafe working conditions with no training", "Condiciones de trabajo inseguras sin capacitación"),
    t("Wrongful termination without notice or severance", "Despido injusto sin aviso ni indemnización"),
  ];

  const contacts = [
    { name: t("Employment Standards Information Centre (Ontario)", "Centro de Información de Normas de Empleo (Ontario)"), phone: "1-800-531-5551" },
    { name: t("Migrant Workers Alliance for Change", "Alianza de Trabajadores Migrantes por el Cambio"), phone: "" },
    { name: t("Workers' Action Centre", "Centro de Acción de Trabajadores"), phone: "416-531-0778" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t("You Have Rights at Work — Know Them", "Tienes Derechos en el Trabajo — Conócelos")}</h1>
        <p className="mb-10 text-lg text-muted-foreground">{t("Whether you're on a work permit or a permanent resident, Canadian labour laws protect you.", "Ya sea que tengas un permiso de trabajo o seas residente permanente, las leyes laborales canadienses te protegen.")}</p>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">{t("Your Basic Rights as a Worker", "Tus Derechos Básicos como Trabajador")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rights.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-2 text-2xl">{r.emoji}</div>
                <h3 className="mb-1 font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("Common Issues Newcomers Face", "Problemas Comunes que Enfrentan los Recién Llegados")}</h2>
          <ul className="space-y-2">
            {issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                {issue}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border-2 border-primary bg-primary/5 p-6">
          <h2 className="mb-2 text-lg font-bold text-primary">{t("Important: Your Work Permit Protects You Too", "Importante: Tu Permiso de Trabajo También Te Protege")}</h2>
          <p className="text-muted-foreground">{t("If you're on a work permit, your employer cannot threaten to revoke it. They do not control your immigration status. If your employer threatens you with deportation, this is illegal. Contact the Migrant Workers Alliance or a legal clinic immediately.", "Si tienes un permiso de trabajo, tu empleador no puede amenazar con revocarlo. Ellos no controlan tu estatus migratorio. Si tu empleador te amenaza con deportación, esto es ilegal. Contacta la Alianza de Trabajadores Migrantes o una clínica legal de inmediato.")}</p>
        </section>

        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("What To Do If Your Rights Are Violated", "Qué Hacer Si Tus Derechos Son Violados")}</h2>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>{t("Keep records — pay stubs, schedules, texts, emails", "Guarda registros — recibos de pago, horarios, textos, correos")}</li>
            <li>{t("Contact your provincial Employment Standards office", "Contacta tu oficina provincial de Normas de Empleo")}</li>
            <li>{t("File a complaint (you can do this anonymously in some provinces)", "Presenta una queja (puedes hacerlo anónimamente en algunas provincias)")}</li>
            <li>{t("Reach out to a workers' rights organization", "Comunícate con una organización de derechos de los trabajadores")}</li>
          </ol>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("Key Contacts", "Contactos Clave")}</h2>
          <div className="space-y-3">
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted">
                <span className="font-medium">{c.name}</span>
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Phone size={14} /> {c.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default WorkplaceRights;
