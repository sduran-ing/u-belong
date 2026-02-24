import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Phone, Globe, MapPin, Star } from "lucide-react";

interface Resource {
  name: string;
  nameEs: string;
  city: string;
  phone: string;
  url: string;
  category: string[];
  tags: string[];
  desc: string;
  descEs: string;
  verified: boolean;
}

const resources: Resource[] = [
  { name: "Community Legal Education Ontario (CLEO)", nameEs: "Educación Legal Comunitaria de Ontario (CLEO)", city: "Province-wide", phone: "", url: "https://cleo.on.ca", category: ["Legal Clinics"], tags: ["Legal Aid", "Free", "Multilingual"], desc: "Province-wide legal information in multiple languages", descEs: "Información legal provincial en múltiples idiomas", verified: true },
  { name: "Parkdale Community Legal Services", nameEs: "Servicios Legales Comunitarios de Parkdale", city: "Toronto", phone: "416-531-2411", url: "", category: ["Legal Clinics"], tags: ["Legal Aid", "Free"], desc: "Free legal help for low-income residents", descEs: "Ayuda legal gratuita para residentes de bajos ingresos", verified: true },
  { name: "Legal Aid Ontario", nameEs: "Ayuda Legal Ontario", city: "Province-wide", phone: "1-800-668-8258", url: "", category: ["Legal Clinics"], tags: ["Legal Aid", "Free"], desc: "Free legal services", descEs: "Servicios legales gratuitos", verified: true },
  { name: "Centre for Spanish Speaking Peoples", nameEs: "Centro para Personas de Habla Hispana", city: "Toronto", phone: "416-533-8545", url: "", category: ["NGOs & Community Orgs"], tags: ["Spanish-Speaking", "Free", "Settlement"], desc: "Settlement, legal, and employment services in Spanish", descEs: "Servicios de asentamiento, legales y de empleo en español", verified: true },
  { name: "FCJ Refugee Centre", nameEs: "Centro de Refugiados FCJ", city: "Toronto", phone: "416-469-9754", url: "", category: ["NGOs & Community Orgs"], tags: ["Refugees", "Free"], desc: "Support for refugees and migrant workers", descEs: "Apoyo para refugiados y trabajadores migrantes", verified: true },
  { name: "ACCES Employment", nameEs: "ACCES Empleo", city: "Multiple locations", phone: "", url: "https://accesemployment.ca", category: ["NGOs & Community Orgs"], tags: ["Employment", "Free", "Newcomers"], desc: "Employment services for newcomers", descEs: "Servicios de empleo para recién llegados", verified: true },
  { name: "Ontario Human Rights Tribunal", nameEs: "Tribunal de Derechos Humanos de Ontario", city: "Ontario", phone: "1-866-598-0322", url: "http://www.hrto.ca", category: ["Government Services", "Reporting Lines"], tags: ["Government", "Anti-Discrimination"], desc: "File and track human rights complaints", descEs: "Presenta y da seguimiento a quejas de derechos humanos", verified: true },
  { name: "Canadian Human Rights Commission", nameEs: "Comisión Canadiense de Derechos Humanos", city: "National", phone: "1-888-214-1090", url: "", category: ["Government Services", "Reporting Lines"], tags: ["Government", "Federal"], desc: "Federal human rights complaints", descEs: "Quejas federales de derechos humanos", verified: true },
  { name: "Ontario Employment Standards", nameEs: "Normas de Empleo de Ontario", city: "Ontario", phone: "1-800-531-5551", url: "", category: ["Government Services"], tags: ["Government", "Employment"], desc: "Employment standards information and complaints", descEs: "Información y quejas sobre normas de empleo", verified: true },
  { name: "Crime Stoppers", nameEs: "Crime Stoppers", city: "National", phone: "1-800-222-8477", url: "", category: ["Reporting Lines"], tags: ["Anonymous", "Safety"], desc: "Anonymous crime reporting", descEs: "Reporte anónimo de crímenes", verified: true },
];

const lawyers = [
  { name: "Maria Garcia-Hernandez", specializations: ["Immigration", "Human Rights"], languages: ["English", "Spanish"], firm: "Garcia Law Professional Corp.", phone: "416-555-0123", knownFor: "Defending migrant workers' rights" },
  { name: "David Chen", specializations: ["Employment", "Human Rights"], languages: ["English", "Mandarin"], firm: "Chen & Associates", phone: "416-555-0456", knownFor: "Workplace discrimination cases" },
  { name: "Amara Okafor", specializations: ["Disability", "Human Rights"], languages: ["English", "French"], firm: "Okafor Legal Services", phone: "416-555-0789", knownFor: "Accessibility accommodation advocacy" },
];

const filterCategories = ["Legal Clinics", "NGOs & Community Orgs", "Government Services", "Reporting Lines"];

const Resources = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = resources.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !activeFilter || r.category.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t("Help Is Closer Than You Think", "La Ayuda Está Más Cerca de lo que Piensas")}</h1>
        <p className="mb-8 text-lg text-muted-foreground">{t("Find legal clinics, community organizations, and reporting lines near you.", "Encuentra clínicas legales, organizaciones comunitarias y líneas de reporte cerca de ti.")}</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Enter your city or postal code", "Ingresa tu ciudad o código postal")}
            className="w-full rounded-xl border bg-background py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource cards */}
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          {filtered.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold">{t(r.name, r.nameEs)}</h3>
                {r.verified && (
                  <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    <Star size={12} /> {t("Verified", "Verificado")}
                  </span>
                )}
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{t(r.desc, r.descEs)}</p>
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} /> {r.city}
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {r.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-secondary/30 px-2 py-0.5 text-xs font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Phone size={14} /> {r.phone}
                  </a>
                )}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <Globe size={14} /> {t("Website", "Sitio Web")}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lawyers */}
        <section>
          <h2 className="mb-2 text-2xl font-bold">{t("Recommended Legal Professionals", "Profesionales Legales Recomendados")}</h2>
          <p className="mb-6 text-muted-foreground">{t("Lawyers experienced in immigration, human rights, and employment law.", "Abogados con experiencia en inmigración, derechos humanos y derecho laboral.")}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {lawyers.map((l, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {l.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="mb-1 font-semibold">{l.name}</h3>
                <p className="mb-2 text-xs text-muted-foreground">{l.firm}</p>
                <div className="mb-2 flex flex-wrap gap-1">
                  {l.specializations.map((s) => (
                    <span key={s} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                  ))}
                </div>
                <p className="mb-2 text-xs text-muted-foreground">🗣️ {l.languages.join(", ")}</p>
                <p className="text-xs text-muted-foreground italic">{t("Known for:", "Conocido por:")} {l.knownFor}</p>
                {l.phone && (
                  <a href={`tel:${l.phone}`} className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline">
                    <Phone size={14} /> {l.phone}
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

export default Resources;
