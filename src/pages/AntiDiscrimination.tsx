import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Home, Briefcase, HeartPulse, MessageCircle } from "lucide-react";

const AntiDiscrimination = () => {
  const { t } = useLanguage();

  const commonTypes = [
    { emoji: "🏠", icon: <Home size={24} />, title: t("Housing", "Vivienda"), desc: t("Landlord refuses to rent to you because of your accent or origin", "El arrendador se niega a rentarte por tu acento u origen") },
    { emoji: "💼", icon: <Briefcase size={24} />, title: t("Employment", "Empleo"), desc: t("Employer won't hire you because of your name or country of education", "El empleador no te contrata por tu nombre o país de educación") },
    { emoji: "🏥", icon: <HeartPulse size={24} />, title: t("Services", "Servicios"), desc: t("Denied service or treated poorly at a clinic, school, or government office", "Servicio denegado o mal trato en clínica, escuela u oficina de gobierno") },
    { emoji: "🗣️", icon: <MessageCircle size={24} />, title: t("Language", "Idioma"), desc: t("Harassed or excluded because you speak Spanish", "Acosado o excluido porque hablas español") },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t("Your Right to Be Treated Equally", "Tu Derecho a Ser Tratado por Igual")}</h1>
        <p className="mb-10 text-lg text-muted-foreground">{t("Canada's laws protect you from discrimination. Here's what you need to know.", "Las leyes de Canadá te protegen de la discriminación. Esto es lo que necesitas saber.")}</p>

        {/* What is discrimination */}
        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-3 text-xl font-bold">{t("What Is Discrimination?", "¿Qué Es la Discriminación?")}</h2>
          <p className="text-muted-foreground">
            {t(
              "Discrimination happens when you are treated unfairly because of who you are — your race, ethnicity, religion, gender, sexual orientation, disability, age, or where you come from. In Canada, this is illegal.",
              "La discriminación ocurre cuando te tratan injustamente por quién eres — tu raza, etnia, religión, género, orientación sexual, discapacidad, edad o de dónde vienes. En Canadá, esto es ilegal."
            )}
          </p>
        </section>

        {/* Laws */}
        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("What Laws Protect You?", "¿Qué Leyes Te Protegen?")}</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/5 p-4">
              <h3 className="font-semibold text-primary">{t("Canadian Human Rights Act", "Ley Canadiense de Derechos Humanos")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("Covers federal services, banks, airlines, telecommunications, and federal workplaces. Protects against discrimination based on 13 grounds including race, national or ethnic origin, and disability.", "Cubre servicios federales, bancos, aerolíneas, telecomunicaciones y lugares de trabajo federales. Protege contra la discriminación basada en 13 motivos, incluyendo raza, origen nacional o étnico, y discapacidad.")}</p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <h3 className="font-semibold text-primary">{t("Provincial Human Rights Codes", "Códigos Provinciales de Derechos Humanos")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("Each province has its own code. For example, Ontario's Human Rights Code protects you in employment, housing, services, and contracts. You don't need to be a citizen to be protected.", "Cada provincia tiene su propio código. Por ejemplo, el Código de Derechos Humanos de Ontario te protege en empleo, vivienda, servicios y contratos. No necesitas ser ciudadano para estar protegido.")}</p>
            </div>
          </div>
        </section>

        {/* Common Types */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">{t("Common Types of Discrimination Newcomers Face", "Tipos Comunes de Discriminación que Enfrentan los Recién Llegados")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {commonTypes.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-2 text-2xl">{item.emoji}</div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What can you do */}
        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("What Can You Do?", "¿Qué Puedes Hacer?")}</h2>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>{t("Document what happened (dates, names, witnesses)", "Documenta lo que pasó (fechas, nombres, testigos)")}</li>
            <li>{t("File a complaint with your provincial Human Rights Commission or the Canadian Human Rights Commission", "Presenta una queja ante la Comisión de Derechos Humanos provincial o la Comisión Canadiense de Derechos Humanos")}</li>
            <li>{t("Contact a community legal clinic for free help", "Contacta una clínica legal comunitaria para ayuda gratuita")}</li>
            <li>{t("You can also report hate crimes to police", "También puedes reportar crímenes de odio a la policía")}</li>
          </ol>
        </section>

        {/* Important notice */}
        <section className="rounded-xl border-2 border-primary bg-primary/5 p-6">
          <h2 className="mb-2 text-lg font-bold text-primary">{t("Important: You Are Protected Regardless of Immigration Status", "Importante: Estás Protegido Sin Importar Tu Estatus Migratorio")}</h2>
          <p className="text-muted-foreground">
            {t(
              "You do not need to be a Canadian citizen or permanent resident to file a human rights complaint. Your immigration status does not affect your right to be treated with dignity.",
              "No necesitas ser ciudadano canadiense o residente permanente para presentar una queja de derechos humanos. Tu estatus migratorio no afecta tu derecho a ser tratado con dignidad."
            )}
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default AntiDiscrimination;
