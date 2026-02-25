import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, lazy, Suspense } from "react";
import { Search, Phone, Globe, MapPin, Star, Mail } from "lucide-react";

const ResourceMap = lazy(() => import("@/components/ResourceMap"));

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

interface Lawyer {
  name: string;
  photo: string;
  specializations: string[];
  languages: { label: string; flag: string }[];
  firm: string;
  location: string;
  phone: string;
  email: string;
}

const lawyers: Lawyer[] = [
  {
    name: "Maria Garcia-Hernandez",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    specializations: ["Immigration", "Human Rights"],
    languages: [{ label: "English", flag: "🇨🇦" }, { label: "Spanish", flag: "🇪🇸" }],
    firm: "Garcia Law Professional Corp.",
    location: "Toronto, ON",
    phone: "416-555-0123",
    email: "maria@garcialaw.ca",
  },
  {
    name: "David Chen",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    specializations: ["Employment", "Human Rights"],
    languages: [{ label: "English", flag: "🇨🇦" }, { label: "Mandarin", flag: "🇨🇳" }],
    firm: "Chen & Associates",
    location: "Toronto, ON",
    phone: "416-555-0456",
    email: "david@chenlaw.ca",
  },
  {
    name: "Amara Okafor",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    specializations: ["Disability", "Human Rights"],
    languages: [{ label: "English", flag: "🇨🇦" }, { label: "French", flag: "🇫🇷" }],
    firm: "Okafor Legal Services",
    location: "Ottawa, ON",
    phone: "416-555-0789",
    email: "amara@okaforlaw.ca",
  },
  {
    name: "Carlos Mendoza",
    photo: "https://randomuser.me/api/portraits/men/78.jpg",
    specializations: ["Immigration", "Family Law"],
    languages: [{ label: "English", flag: "🇨🇦" }, { label: "Spanish", flag: "🇪🇸" }, { label: "Portuguese", flag: "🇧🇷" }],
    firm: "Mendoza Immigration Law",
    location: "Vancouver, BC",
    phone: "604-555-0321",
    email: "carlos@mendozalaw.ca",
  },
  {
    name: "Fatima Al-Rashid",
    photo: "https://randomuser.me/api/portraits/women/25.jpg",
    specializations: ["Housing", "Human Rights"],
    languages: [{ label: "English", flag: "🇨🇦" }, { label: "French", flag: "🇫🇷" }],
    firm: "Al-Rashid & Partners",
    location: "Montréal, QC",
    phone: "514-555-0654",
    email: "fatima@alrashidlaw.ca",
  },
  {
    name: "Roberto Alvarez",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",
    specializations: ["Employment", "Immigration"],
    languages: [{ label: "English", flag: "🇨🇦" }, { label: "Spanish", flag: "🇪🇸" }],
    firm: "Alvarez Workplace Law",
    location: "Calgary, AB",
    phone: "403-555-0987",
    email: "roberto@alvarezlaw.ca",
  },
];

const lawyerSpecialties = ["All", "Immigration", "Human Rights", "Employment", "Disability", "Housing", "Family Law"];

const specialtyColors: Record<string, string> = {
  Immigration: "bg-primary/15 text-primary",
  "Human Rights": "bg-accent/15 text-accent",
  Employment: "bg-secondary/80 text-foreground",
  Disability: "bg-primary/15 text-primary",
  Housing: "bg-success/15 text-success",
  "Family Law": "bg-secondary/80 text-foreground",
};

const filterCategories = ["Legal Clinics", "NGOs & Community Orgs", "Government Services", "Reporting Lines"];

const Resources = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [lawyerSearch, setLawyerSearch] = useState("");
  const [lawyerFilter, setLawyerFilter] = useState("All");

  const filtered = resources.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !activeFilter || r.category.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const filteredLawyers = lawyers.filter((l) => {
    const matchesSearch = !lawyerSearch || l.name.toLowerCase().includes(lawyerSearch.toLowerCase()) || l.specializations.some((s) => s.toLowerCase().includes(lawyerSearch.toLowerCase()));
    const matchesFilter = lawyerFilter === "All" || l.specializations.includes(lawyerFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t("Help Is Closer Than You Think", "La Ayuda Está Más Cerca de lo que Piensas")}</h1>
        <p className="mb-8 text-lg text-muted-foreground">{t("Find legal clinics, community organizations, and reporting lines near you.", "Encuentra clínicas legales, organizaciones comunitarias y líneas de reporte cerca de ti.")}</p>

        {/* Interactive Map */}
        <Suspense fallback={<div className="mb-12 h-[600px] animate-pulse rounded-xl bg-muted" />}>
          <ResourceMap />
        </Suspense>

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

          {/* Specialty filter pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            {lawyerSpecialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setLawyerFilter(spec)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  lawyerFilter === spec ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={lawyerSearch}
              onChange={(e) => setLawyerSearch(e.target.value)}
              placeholder={t("Search by name or specialty", "Buscar por nombre o especialidad")}
              className="w-full rounded-xl border bg-background py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {filteredLawyers.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={l.photo}
                    alt={l.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h3 className="font-bold">{l.name}</h3>
                    <p className="text-xs text-muted-foreground">{l.firm}</p>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {l.specializations.map((s) => (
                    <span key={s} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${specialtyColors[s] || "bg-muted text-foreground"}`}>
                      {s}
                    </span>
                  ))}
                </div>

                <p className="mb-2 text-xs text-muted-foreground">
                  {l.languages.map((lang) => `${lang.flag} ${lang.label}`).join("  ")}
                </p>

                <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} /> {l.location}
                </div>

                <div className="mt-3 flex flex-col gap-1.5 text-sm">
                  <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 text-primary hover:underline">
                    <Phone size={14} /> {l.phone}
                  </a>
                  <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 text-primary hover:underline">
                    <Mail size={14} /> {l.email}
                  </a>
                </div>

                <a
                  href={`mailto:${l.email}?subject=Consultation Request`}
                  className="mt-4 block w-full rounded-xl bg-accent py-2.5 text-center text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
                >
                  {t("Book Consultation", "Reservar Consulta")}
                </a>
              </motion.div>
            ))}
            {filteredLawyers.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8">
                {t("No lawyers found matching your criteria.", "No se encontraron abogados que coincidan con sus criterios.")}
              </p>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Resources;
