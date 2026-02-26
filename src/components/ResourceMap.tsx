import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Phone, Globe, MapPin, Clock, X, List, Map } from "lucide-react";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapResource {
  name: string;
  nameEs: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  url: string;
  category: string;
  languages: string[];
  hours: string;
  lat: number;
  lng: number;
}

const categoryColors: Record<string, { color: string; label: string; labelEs: string; emoji: string }> = {
  "Legal Clinics": { color: "#3B82F6", label: "Legal Clinics", labelEs: "Clínicas Legales", emoji: "🔵" },
  "Settlement Agencies": { color: "#22C55E", label: "Settlement Agencies", labelEs: "Agencias de Asentamiento", emoji: "🟢" },
  "NGOs": { color: "#F97316", label: "NGOs & Advocacy", labelEs: "ONGs y Defensoría", emoji: "🟠" },
  "Government Services": { color: "#EF4444", label: "Government Services", labelEs: "Servicios Gubernamentales", emoji: "🔴" },
  "Disability Support": { color: "#A855F7", label: "Disability Support", labelEs: "Apoyo a Discapacidad", emoji: "🟣" },
  "Workers' Rights": { color: "#EAB308", label: "Workers' Rights", labelEs: "Derechos Laborales", emoji: "🟡" },
  "Shelters & Crisis": { color: "#6B7280", label: "Shelters & Crisis", labelEs: "Refugios y Crisis", emoji: "⚪" },
};

const mapResources: MapResource[] = [
  { name: "Parkdale Community Legal Services", nameEs: "Servicios Legales Comunitarios de Parkdale", address: "1266 Queen St W", city: "Toronto", province: "ON", phone: "416-531-2411", url: "", category: "Legal Clinics", languages: ["English", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 43.6387, lng: -79.4280 },
  { name: "Centre for Spanish Speaking Peoples", nameEs: "Centro para Personas de Habla Hispana", address: "2141 Jane St", city: "Toronto", province: "ON", phone: "416-533-8545", url: "", category: "Settlement Agencies", languages: ["English", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 43.6890, lng: -79.5040 },
  { name: "FCJ Refugee Centre", nameEs: "Centro de Refugiados FCJ", address: "208 Oakwood Ave", city: "Toronto", province: "ON", phone: "416-469-9754", url: "", category: "NGOs", languages: ["English", "Spanish", "French"], hours: "Mon-Fri 9AM-5PM", lat: 43.6780, lng: -79.4280 },
  { name: "ACCES Employment", nameEs: "ACCES Empleo", address: "489 College St", city: "Toronto", province: "ON", phone: "416-921-1800", url: "https://accesemployment.ca", category: "Workers' Rights", languages: ["English", "French", "Spanish"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 43.6560, lng: -79.4080 },
  { name: "Ontario Human Rights Tribunal", nameEs: "Tribunal de Derechos Humanos de Ontario", address: "655 Bay St", city: "Toronto", province: "ON", phone: "1-866-598-0322", url: "http://www.hrto.ca", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-5PM", lat: 43.6590, lng: -79.3854 },
  { name: "ARCH Disability Law Centre", nameEs: "Centro Legal de Discapacidad ARCH", address: "55 University Ave", city: "Toronto", province: "ON", phone: "416-482-8255", url: "https://archdisabilitylaw.ca", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 43.6498, lng: -79.3856 },
  { name: "Sojourn House", nameEs: "Casa Sojourn", address: "101 Ontario St", city: "Toronto", province: "ON", phone: "416-864-9136", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 43.6580, lng: -79.3640 },
  { name: "Workers' Action Centre", nameEs: "Centro de Acción para Trabajadores", address: "720 Spadina Ave", city: "Toronto", province: "ON", phone: "416-531-0778", url: "", category: "Workers' Rights", languages: ["English", "Spanish"], hours: "Mon-Fri 10AM-5PM", lat: 43.6640, lng: -79.4040 },
  { name: "Legal Aid Ontario - Ottawa", nameEs: "Ayuda Legal Ontario - Ottawa", address: "73 Albert St", city: "Ottawa", province: "ON", phone: "613-238-7931", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-5PM", lat: 45.4208, lng: -75.6990 },
  { name: "MOSAIC", nameEs: "MOSAIC", address: "1720 Grant St", city: "Vancouver", province: "BC", phone: "604-254-9626", url: "https://mosaicbc.org", category: "Settlement Agencies", languages: ["English", "Spanish", "Mandarin"], hours: "Mon-Fri 9AM-5PM", lat: 49.2764, lng: -123.0650 },
  { name: "Access Pro Bono", nameEs: "Access Pro Bono", address: "300-1140 W Pender St", city: "Vancouver", province: "BC", phone: "604-878-7400", url: "https://accessprobono.ca", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 49.2877, lng: -123.1180 },
  { name: "Disability Alliance BC", nameEs: "Alianza de Discapacidad BC", address: "204-456 W Broadway", city: "Vancouver", province: "BC", phone: "604-875-0188", url: "https://disabilityalliancebc.org", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 49.2635, lng: -123.1150 },
  { name: "Commission des droits de la personne", nameEs: "Comisión de Derechos de la Persona", address: "360 rue Saint-Jacques", city: "Montréal", province: "QC", phone: "514-873-5146", url: "", category: "Government Services", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5020, lng: -73.5582 },
  { name: "CARI St-Laurent", nameEs: "CARI St-Laurent", address: "1595 boul. de l'Avenir", city: "Montréal", province: "QC", phone: "514-748-2007", url: "", category: "Settlement Agencies", languages: ["French", "English", "Spanish"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5120, lng: -73.6710 },
  { name: "Calgary Legal Guidance", nameEs: "Guía Legal de Calgary", address: "840 7 Ave SW", city: "Calgary", province: "AB", phone: "403-234-9266", url: "https://clg.ab.ca", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 51.0456, lng: -114.0780 },
  { name: "Action for Healthy Communities", nameEs: "Acción para Comunidades Saludables", address: "10578 113 St NW", city: "Edmonton", province: "AB", phone: "780-421-2870", url: "", category: "Settlement Agencies", languages: ["English", "Spanish", "French"], hours: "Mon-Fri 9AM-4:30PM", lat: 53.5390, lng: -113.5110 },
  { name: "Manitoba Interfaith Immigration Council", nameEs: "Consejo Interreligioso de Inmigración de Manitoba", address: "400 Edmonton St", city: "Winnipeg", province: "MB", phone: "204-977-1000", url: "", category: "Settlement Agencies", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8850, lng: -97.1370 },
  { name: "Halifax Refugee Clinic", nameEs: "Clínica de Refugiados de Halifax", address: "6169 Quinpool Rd", city: "Halifax", province: "NS", phone: "902-422-6736", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 44.6440, lng: -63.5930 },
  { name: "Regina Open Door Society", nameEs: "Sociedad Puertas Abiertas de Regina", address: "1855 Smith St", city: "Regina", province: "SK", phone: "306-352-3500", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 50.4540, lng: -104.6110 },
];

const provinces = [
  { value: "ALL", label: "All Canada", labelEs: "Todo Canadá" },
  { value: "AB", label: "Alberta", labelEs: "Alberta" },
  { value: "BC", label: "British Columbia", labelEs: "Columbia Británica" },
  { value: "MB", label: "Manitoba", labelEs: "Manitoba" },
  { value: "NB", label: "New Brunswick", labelEs: "Nuevo Brunswick" },
  { value: "NL", label: "Newfoundland & Labrador", labelEs: "Terranova y Labrador" },
  { value: "NS", label: "Nova Scotia", labelEs: "Nueva Escocia" },
  { value: "NT", label: "Northwest Territories", labelEs: "Territorios del Noroeste" },
  { value: "NU", label: "Nunavut", labelEs: "Nunavut" },
  { value: "ON", label: "Ontario", labelEs: "Ontario" },
  { value: "PE", label: "Prince Edward Island", labelEs: "Isla del Príncipe Eduardo" },
  { value: "QC", label: "Quebec", labelEs: "Quebec" },
  { value: "SK", label: "Saskatchewan", labelEs: "Saskatchewan" },
  { value: "YT", label: "Yukon", labelEs: "Yukón" },
];

const provinceCenters: Record<string, { lat: number; lng: number; zoom: number }> = {
  ALL: { lat: 56.13, lng: -106.35, zoom: 4 },
  AB: { lat: 53.93, lng: -116.58, zoom: 6 },
  BC: { lat: 53.73, lng: -127.65, zoom: 5 },
  MB: { lat: 53.76, lng: -98.81, zoom: 6 },
  NB: { lat: 46.5, lng: -66.16, zoom: 7 },
  NL: { lat: 53.14, lng: -57.66, zoom: 5 },
  NS: { lat: 44.68, lng: -63.74, zoom: 7 },
  NT: { lat: 64.27, lng: -119.18, zoom: 5 },
  NU: { lat: 70.3, lng: -83.11, zoom: 4 },
  ON: { lat: 51.25, lng: -85.32, zoom: 5 },
  PE: { lat: 46.24, lng: -63.13, zoom: 8 },
  QC: { lat: 52.94, lng: -73.55, zoom: 5 },
  SK: { lat: 52.94, lng: -106.45, zoom: 6 },
  YT: { lat: 64.28, lng: -135.0, zoom: 5 },
};

const mapCategories = ["All", "Legal Clinics", "Settlement Agencies", "NGOs", "Government Services", "Disability Support", "Workers' Rights", "Shelters & Crisis"];

const postalMap: Record<string, { lat: number; lng: number }> = {
  A: { lat: 47.56, lng: -52.71 }, B: { lat: 44.65, lng: -63.57 }, C: { lat: 46.24, lng: -63.13 },
  E: { lat: 46.5, lng: -66.16 }, G: { lat: 46.81, lng: -71.21 }, H: { lat: 45.50, lng: -73.57 },
  J: { lat: 45.53, lng: -73.6 }, K: { lat: 45.42, lng: -75.7 }, L: { lat: 43.65, lng: -79.38 },
  M: { lat: 43.65, lng: -79.38 }, N: { lat: 43.0, lng: -81.27 }, P: { lat: 46.49, lng: -81.0 },
  R: { lat: 49.88, lng: -97.14 }, S: { lat: 50.45, lng: -104.62 }, T: { lat: 51.05, lng: -114.07 },
  V: { lat: 49.28, lng: -123.12 }, X: { lat: 62.45, lng: -114.37 }, Y: { lat: 60.72, lng: -135.05 },
};

function createColoredIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -13],
  });
}

const ResourceMap = () => {
  const { t } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [selectedProvince, setSelectedProvince] = useState("ALL");
  const [postalCode, setPostalCode] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  const hasActiveFilters = selectedProvince !== "ALL" || activeCategory !== "All";

  const clearFilters = () => {
    setSelectedProvince("ALL");
    setActiveCategory("All");
    const pc = provinceCenters.ALL;
    mapRef.current?.flyTo([pc.lat, pc.lng], pc.zoom, { duration: 1.2 });
  };

  const filteredResources = useMemo(() => {
    return mapResources.filter((r) => {
      const matchesProvince = selectedProvince === "ALL" || r.province === selectedProvince;
      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      return matchesProvince && matchesCategory;
    });
  }, [selectedProvince, activeCategory]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([56.13, -106.35], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    filteredResources.forEach((r) => {
      const color = categoryColors[r.category]?.color || "#6B7280";
      const catLabel = categoryColors[r.category];
      const marker = L.marker([r.lat, r.lng], { icon: createColoredIcon(color) });
      marker.bindPopup(`
        <div style="min-width:200px">
          <strong>${r.name}</strong><br/>
          <span style="font-size:12px;color:#666">${r.address}, ${r.city}, ${r.province}</span><br/>
          ${r.phone ? `<a href="tel:${r.phone}" style="font-size:12px">📞 ${r.phone}</a><br/>` : ""}
          ${r.url ? `<a href="${r.url}" target="_blank" style="font-size:12px">🌐 Website</a><br/>` : ""}
          <span style="font-size:11px;color:#666">🗣️ ${r.languages.join(", ")}</span><br/>
          <span style="font-size:11px;color:#666">🕐 ${r.hours}</span><br/>
          <span style="display:inline-block;margin-top:4px;background:${color};color:white;padding:1px 8px;border-radius:10px;font-size:10px">${catLabel?.label || r.category}</span>
        </div>
      `);
      marker.addTo(markersRef.current!);
    });
  }, [filteredResources]);

  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    const pc = provinceCenters[prov] || provinceCenters.ALL;
    mapRef.current?.flyTo([pc.lat, pc.lng], pc.zoom, { duration: 1.2 });
  };

  const handlePostalSearch = () => {
    if (!postalCode.trim()) return;
    const coords = postalMap[postalCode.trim().toUpperCase()[0]];
    if (coords) {
      mapRef.current?.flyTo([coords.lat, coords.lng], 11, { duration: 1.2 });
    }
  };

  return (
    <section className="mb-12">
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <select
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full appearance-none rounded-xl border bg-card px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto"
          >
            {provinces.map((p) => (
              <option key={p.value} value={p.value}>{t(p.label, p.labelEs)}</option>
            ))}
          </select>
          <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostalSearch()}
            placeholder={t("Enter postal code", "Código postal")}
            maxLength={7}
            className="w-full rounded-xl border bg-background py-2.5 pl-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-48"
          />
          <button onClick={handlePostalSearch} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Category chips + clear + count */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {mapCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"}`}
          >
            {cat !== "All" && categoryColors[cat] ? `${categoryColors[cat].emoji} ` : ""}
            {cat === "All" ? t("All", "Todos") : t(categoryColors[cat]?.label || cat, categoryColors[cat]?.labelEs || cat)}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <X size={12} /> {t("Clear filters", "Limpiar filtros")}
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mb-3 text-sm text-muted-foreground">
        {t(`Showing ${filteredResources.length} resources`, `Mostrando ${filteredResources.length} recursos`)}
      </p>

      {/* Mobile toggle */}
      <div className="mb-3 flex gap-2 sm:hidden">
        <button
          onClick={() => setMobileView("map")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${mobileView === "map" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
        >
          <Map size={14} /> {t("Map view", "Vista de mapa")}
        </button>
        <button
          onClick={() => setMobileView("list")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${mobileView === "list" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
        >
          <List size={14} /> {t("List view", "Vista de lista")}
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapContainerRef}
        className={`overflow-hidden rounded-xl border shadow-md ${mobileView === "list" ? "hidden sm:block" : ""}`}
        style={{ height: "450px", zIndex: 0 }}
      />

      {/* Legend */}
      <div className={`mt-3 flex flex-wrap gap-x-4 gap-y-1.5 ${mobileView === "list" ? "hidden sm:flex" : ""}`}>
        {Object.entries(categoryColors).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: val.color }} />
            {t(val.label, val.labelEs)}
          </div>
        ))}
      </div>

      {/* Card list */}
      <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${mobileView === "map" ? "hidden sm:grid" : ""}`}>
        {filteredResources.map((r, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold">{t(r.name, r.nameEs)}</h4>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: categoryColors[r.category]?.color || "#6B7280" }}>
                {t(categoryColors[r.category]?.label || r.category, categoryColors[r.category]?.labelEs || r.category)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={11} /> {r.address}, {r.city}, {r.province}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {r.phone && (
                <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                  <Phone size={11} /> {r.phone}
                </a>
              )}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <Globe size={11} /> {t("Website", "Sitio Web")}
                </a>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 text-[11px] text-muted-foreground">
              <span>🗣️ {r.languages.join(", ")}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {r.hours}</span>
            </div>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted-foreground">
            {t("No resources found for the selected filters.", "No se encontraron recursos para los filtros seleccionados.")}
          </p>
        )}
      </div>
    </section>
  );
};

export default ResourceMap;
