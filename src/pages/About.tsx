import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dianaPhoto from "@/assets/Diana.jpeg";
import santiagoPhoto from "@/assets/Santiago.jpg";
import davidPhoto from "@/assets/David.jpeg";

const teamMembers = [
  { name: "Diana Mayorga", role: "Lead Developer", roleEs: "Desarrolladora Líder", bio: "Passionate about using technology to empower marginalized communities.", bioEs: "Apasionada por usar la tecnología para empoderar a comunidades marginalizadas.", photo: dianaPhoto },
  { name: "Santiago Duran", role: "UX Designer", roleEs: "Diseñador UX", bio: "Designs inclusive digital experiences that bridge language and cultural barriers.", bioEs: "Diseña experiencias digitales inclusivas que conectan barreras de idioma y cultura.", photo: santiagoPhoto },
  { name: "David Rocha", role: "Research & Content", roleEs: "Investigación y Contenido", bio: "Ensures all legal information is accurate, accessible, and culturally sensitive.", bioEs: "Asegura que toda la información legal sea precisa, accesible y culturalmente sensible.", photo: davidPhoto },
];

const About = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("Message sent!", "¡Mensaje enviado!"),
      description: t("We'll get back to you soon.", "Te responderemos pronto."),
    });
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t("Meet Team Tiyapuy", "Conoce al Equipo Tiyapuy")}</h1>
        <p className="mb-10 text-lg text-muted-foreground">{t("Building bridges of belonging through technology.", "Construyendo puentes de pertenencia a través de la tecnología.")}</p>

        <section className="mb-10 rounded-xl border bg-card p-6 shadow-md">
          <p className="text-muted-foreground leading-relaxed">
            {t(
              "Tiyapuy is a team of three passionate technologists and advocates who believe that everyone deserves to feel safe, informed, and empowered in their new home. Our name comes from Quechua and carries the spirit of collective growth — because belonging is something we build together.",
              "Tiyapuy es un equipo de tres apasionados tecnólogos y defensores que creen que todos merecen sentirse seguros, informados y empoderados en su nuevo hogar. Nuestro nombre viene del quechua y lleva el espíritu de crecimiento colectivo — porque la pertenencia es algo que construimos juntos."
            )}
          </p>
        </section>

        {/* Team cards */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {teamMembers.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <img src={m.photo} alt={m.name} className="mx-auto mb-4 h-20 w-20 rounded-full object-cover" />
              <h3 className="font-semibold">{m.name}</h3>
              <p className="mb-2 text-sm text-primary">{t(m.role, m.roleEs)}</p>
              <p className="text-xs text-muted-foreground">{t(m.bio, m.bioEs)}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <section className="mb-10 rounded-xl bg-primary p-8 text-primary-foreground shadow-lg">
          <h2 className="mb-3 text-xl font-bold">{t("Our Mission", "Nuestra Misión")}</h2>
          <p className="leading-relaxed opacity-95">
            {t(
              "To ensure that every newcomer in Canada has clear, accessible, and compassionate guidance to exercise their civic rights — because knowing your rights is the first step to belonging.",
              "Asegurar que cada recién llegado a Canadá tenga orientación clara, accesible y compasiva para ejercer sus derechos cívicos — porque conocer tus derechos es el primer paso hacia la pertenencia."
            )}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-bold">{t("Contact Us", "Contáctanos")}</h2>
          <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={16} /> tiyapuy@ubelong.ca
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder={t("Name", "Nombre")}
              required
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder={t("Email", "Correo Electrónico")}
              required
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder={t("Message", "Mensaje")}
              rows={4}
              required
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Send size={16} /> {t("Send Message", "Enviar Mensaje")}
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
};

export default About;
