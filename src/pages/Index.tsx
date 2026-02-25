import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Shield, Accessibility, Briefcase, MapPin, Scale, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import IntakeForm from "@/components/IntakeForm";
import heroImage from "@/assets/hero-community.jpg";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Index = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      emoji: "🛡️",
      title: t("Anti-Discrimination", "Anti-Discriminación"),
      desc: t("Know your protections under Canadian law", "Conoce tus protecciones bajo la ley canadiense"),
      path: "/anti-discrimination",
    },
    {
      icon: <Accessibility className="h-8 w-8 text-primary" />,
      emoji: "♿",
      title: t("Disability Rights", "Derechos de Discapacidad"),
      desc: t("Access the supports and accommodations you deserve", "Accede a los apoyos y adaptaciones que mereces"),
      path: "/disability-rights",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      emoji: "💼",
      title: t("Workplace Rights", "Derechos Laborales"),
      desc: t("Understand your rights as a worker in Canada", "Entiende tus derechos como trabajador en Canadá"),
      path: "/workplace-rights",
    },
    {
      emoji: "🗺️",
      title: t("Organizations", "Organizaciones"),
      desc: t("Find community support and legal clinics near you", "Encuentra apoyo comunitario y clínicas legales cerca de ti"),
      path: "/organizations",
    },
    {
      emoji: "⚖️",
      title: t("Lawyers", "Abogados"),
      desc: t("Connect with legal professionals who speak your language", "Conéctate con profesionales legales que hablan tu idioma"),
      path: "/lawyers",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Community belonging" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div {...fadeIn} className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-background md:text-5xl lg:text-6xl">
              {t("You belong here.", "Tú perteneces aquí.")}
              <br />
              <span className="text-secondary">
                {t("We'll help you protect your rights.", "Te ayudaremos a proteger tus derechos.")}
              </span>
            </h1>
            <p className="mb-8 text-lg text-background/90 md:text-xl">
              {t(
                "Free, confidential guidance for newcomers in Canada facing discrimination, workplace issues, or accessibility barriers.",
                "Orientación gratuita y confidencial para recién llegados a Canadá que enfrentan discriminación, problemas laborales o barreras de accesibilidad."
              )}
            </p>
            <a
              href="#intake"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-accent-foreground shadow-lg transition-transform hover:scale-105"
            >
              {t("Get Help Now", "Obtén Ayuda Ahora")} <ArrowDown size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div {...fadeIn} className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t(
              "U Belong is your personal civic rights assistant. Whether you've experienced discrimination, need help understanding your workplace rights, or want to know what disability supports are available to you — we're here to guide you step by step. Everything is free, confidential, and available in Spanish.",
              "U Belong es tu asistente personal de derechos cívicos. Ya sea que hayas experimentado discriminación, necesites ayuda para entender tus derechos laborales, o quieras saber qué apoyos de discapacidad están disponibles para ti — estamos aquí para guiarte paso a paso. Todo es gratuito, confidencial y disponible en español."
            )}
          </p>
        </motion.div>

        {/* Pillar Cards */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <Link
                to={p.path}
                className="group flex h-full flex-col rounded-xl border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {p.emoji}
                </div>
                <h3 className="mb-2 text-lg font-bold">{p.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground">{p.desc}</p>
                <span className="mt-3 inline-block text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {t("Learn more →", "Saber más →")}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Intake Form */}
      <section id="intake" className="container mx-auto px-4 pb-20">
        <IntakeForm />
      </section>
    </div>
  );
};

export default Index;
