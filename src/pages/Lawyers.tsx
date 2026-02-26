import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Phone, MapPin, Mail, X } from "lucide-react";

interface Lawyer {
  name: string;
  photo: string;
  specializations: string[];
  languages: { label: string; flag: string }[];
  firm: string;
  location: string;
  province: string;
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
    province: "ON",
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
    province: "ON",
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
    province: "ON",
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
    province: "BC",
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
    province: "QC",
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
    province: "AB",
    phone: "403-555-0987",
    email: "roberto@alvarezlaw.ca",
  },
];

const specialties = ["All", "Immigration", "Human Rights", "Employment", "Disability", "Housing", "Family Law"];
const languageOptions = ["All Languages", "English", "Spanish", "French", "Mandarin", "Portuguese"];
const provinceOptions = [
  { value: "All", label: "All Provinces" },
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "QC", label: "Quebec" },
  { value: "AB", label: "Alberta" },
];

const specialtyColors: Record<string, string> = {
  Immigration: "bg-primary/15 text-primary",
  "Human Rights": "bg-accent/15 text-accent",
  Employment: "bg-secondary/80 text-foreground",
  Disability: "bg-primary/15 text-primary",
  Housing: "bg-success/15 text-success",
  "Family Law": "bg-secondary/80 text-foreground",
};

const Lawyers = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All Languages");
  const [provFilter, setProvFilter] = useState("All");

  const hasActiveFilters = filter !== "All" || langFilter !== "All Languages" || provFilter !== "All" || search.length > 0;

  const clearFilters = () => {
    setFilter("All");
    setLangFilter("All Languages");
    setProvFilter("All");
    setSearch("");
  };

  const filtered = lawyers.filter((l) => {
    const matchesSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "All" || l.specializations.includes(filter);
    const matchesLang = langFilter === "All Languages" || l.languages.some((lang) => lang.label === langFilter);
    const matchesProv = provFilter === "All" || l.province === provFilter;
    return matchesSearch && matchesFilter && matchesLang && matchesProv;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
          {t("Recommended Legal Professionals", "Profesionales Legales Recomendados")}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {t(
            "Experienced lawyers who understand newcomer challenges — filtered by specialty",
            "Abogados experimentados que entienden los desafíos de los recién llegados — filtrados por especialidad"
          )}
        </p>

        {/* Sticky filters */}
        <div className="sticky top-16 z-10 -mx-4 bg-background px-4 pb-4 pt-2">
          {/* Dropdowns row */}
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="rounded-xl border bg-card px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languageOptions.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={provFilter}
              onChange={(e) => setProvFilter(e.target.value)}
              className="rounded-xl border bg-card px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {provinceOptions.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Specialty filter pills */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setFilter(spec)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === spec ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {spec}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <X size={12} /> {t("Clear all", "Limpiar todo")}
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search by name or specialty", "Buscar por nombre o especialidad")}
              className="w-full rounded-xl border bg-background py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Results count */}
          <p className="mt-2 text-sm text-muted-foreground">
            {t(`Showing ${filtered.length} lawyers`, `Mostrando ${filtered.length} abogados`)}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {filtered.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <img src={l.photo} alt={l.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20" />
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
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted-foreground">
              {t("No lawyers found matching your criteria.", "No se encontraron abogados que coincidan con sus criterios.")}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Lawyers;
