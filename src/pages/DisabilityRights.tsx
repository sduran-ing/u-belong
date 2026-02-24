import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Home, Bus } from "lucide-react";

const DisabilityRights = () => {
  const { t } = useLanguage();

  const accommodations = [
    { emoji: "🏢", title: t("At Work", "En el Trabajo"), desc: t("Modified duties, flexible hours, assistive technology, ergonomic equipment", "Tareas modificadas, horarios flexibles, tecnología de asistencia, equipo ergonómico") },
    { emoji: "🏫", title: t("At School", "En la Escuela"), desc: t("Extended test time, note-taking support, accessible materials", "Tiempo extendido para exámenes, apoyo para tomar notas, materiales accesibles") },
    { emoji: "🏠", title: t("In Housing", "En la Vivienda"), desc: t("Ramps, grab bars, service animals allowed regardless of pet policies", "Rampas, barras de apoyo, animales de servicio permitidos sin importar políticas de mascotas") },
    { emoji: "🚌", title: t("In Public Services", "En Servicios Públicos"), desc: t("Accessible transit, sign language interpretation, documents in alternate formats", "Tránsito accesible, interpretación en lenguaje de señas, documentos en formatos alternativos") },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t("Access and Accommodation Are Your Right", "El Acceso y la Adaptación Son Tu Derecho")}</h1>
        <p className="mb-10 text-lg text-muted-foreground">{t("Canada has strong laws to ensure people with disabilities can participate fully in society.", "Canadá tiene leyes sólidas para asegurar que las personas con discapacidad puedan participar plenamente en la sociedad.")}</p>

        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-3 text-xl font-bold">{t("What Counts as a Disability?", "¿Qué Cuenta como Discapacidad?")}</h2>
          <p className="text-muted-foreground">{t("In Canada, disability is defined broadly. It includes physical disabilities, mental health conditions, learning disabilities, chronic illnesses, and sensory impairments. You don't need a formal diagnosis to request accommodation in many cases.", "En Canadá, la discapacidad se define ampliamente. Incluye discapacidades físicas, condiciones de salud mental, discapacidades de aprendizaje, enfermedades crónicas y discapacidades sensoriales. No necesitas un diagnóstico formal para solicitar adaptaciones en muchos casos.")}</p>
        </section>

        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("Key Laws That Protect You", "Leyes Clave que Te Protegen")}</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/5 p-4">
              <h3 className="font-semibold text-primary">{t("Accessible Canada Act (Federal)", "Ley de Canadá Accesible (Federal)")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("Aims to create a barrier-free Canada by 2040. Covers federal institutions and services.", "Busca crear un Canadá sin barreras para 2040. Cubre instituciones y servicios federales.")}</p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <h3 className="font-semibold text-primary">{t("AODA (Ontario)", "AODA (Ontario)")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("Ontario's law requiring organizations to identify, remove, and prevent barriers for people with disabilities.", "Ley de Ontario que requiere que las organizaciones identifiquen, eliminen y prevengan barreras para personas con discapacidad.")}</p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <h3 className="font-semibold text-primary">{t("Provincial Human Rights Codes", "Códigos Provinciales de Derechos Humanos")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("Disability is a protected ground in every province. Employers, landlords, and service providers must accommodate you up to the point of 'undue hardship.'", "La discapacidad es un motivo protegido en cada provincia. Empleadores, arrendadores y proveedores de servicios deben acomodarte hasta el punto de 'dificultad excesiva.'")}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">{t("Your Right to Accommodation", "Tu Derecho a la Adaptación")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {accommodations.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-2 text-2xl">{item.emoji}</div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-3 text-xl font-bold">{t("How to Request Accommodation", "Cómo Solicitar una Adaptación")}</h2>
          <p className="text-muted-foreground">{t("You have the right to ask for accommodation. Your employer, school, or service provider has a legal duty to work with you to find a solution. You may need to provide medical documentation, but they cannot ask for your full diagnosis — only what barriers you face and what supports you need.", "Tienes derecho a pedir una adaptación. Tu empleador, escuela o proveedor de servicios tiene el deber legal de trabajar contigo para encontrar una solución. Es posible que necesites proporcionar documentación médica, pero no pueden pedirte tu diagnóstico completo — solo qué barreras enfrentas y qué apoyos necesitas.")}</p>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">{t("What If You're Denied?", "¿Qué Hacer Si Te Niegan?")}</h2>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>{t("Put your request in writing", "Pon tu solicitud por escrito")}</li>
            <li>{t("If denied, ask for the reason in writing", "Si te niegan, pide la razón por escrito")}</li>
            <li>{t("Contact your provincial Human Rights Commission", "Contacta tu Comisión Provincial de Derechos Humanos")}</li>
            <li>{t("Seek help from a disability advocacy organization", "Busca ayuda de una organización de defensa de personas con discapacidad")}</li>
          </ol>
        </section>
      </motion.div>
    </div>
  );
};

export default DisabilityRights;
