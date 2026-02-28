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
  // ===== ONTARIO =====
  // Legal Clinics
  { name: "Parkdale Community Legal Services", nameEs: "Servicios Legales Comunitarios de Parkdale", address: "1266 Queen St W", city: "Toronto", province: "ON", phone: "416-531-2411", url: "", category: "Legal Clinics", languages: ["English", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 43.6387, lng: -79.4280 },
  { name: "Legal Aid Ontario - Ottawa", nameEs: "Ayuda Legal Ontario - Ottawa", address: "73 Albert St", city: "Ottawa", province: "ON", phone: "613-238-7931", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-5PM", lat: 45.4208, lng: -75.6990 },
  { name: "Community Legal Clinic - Simcoe Haldimand Norfolk", nameEs: "Clínica Legal Comunitaria - Simcoe Haldimand Norfolk", address: "70 Town Centre Dr", city: "Simcoe", province: "ON", phone: "519-426-0460", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 42.8356, lng: -80.3038 },
  { name: "Hamilton Community Legal Clinic", nameEs: "Clínica Legal Comunitaria de Hamilton", address: "100 Main St E", city: "Hamilton", province: "ON", phone: "905-527-4572", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 43.2557, lng: -79.8711 },
  { name: "South Ottawa Community Legal Services", nameEs: "Servicios Legales Comunitarios del Sur de Ottawa", address: "406 MacLaren St", city: "Ottawa", province: "ON", phone: "613-733-0140", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 45.4140, lng: -75.6920 },
  { name: "Waterloo Region Community Legal Services", nameEs: "Servicios Legales Comunitarios de Waterloo", address: "170 Victoria St S", city: "Kitchener", province: "ON", phone: "519-743-0254", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 43.4480, lng: -80.4890 },
  // Settlement Agencies
  { name: "Centre for Spanish Speaking Peoples", nameEs: "Centro para Personas de Habla Hispana", address: "2141 Jane St", city: "Toronto", province: "ON", phone: "416-533-8545", url: "", category: "Settlement Agencies", languages: ["English", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 43.6890, lng: -79.5040 },
  { name: "COSTI Immigrant Services", nameEs: "Servicios para Inmigrantes COSTI", address: "1710 Dufferin St", city: "Toronto", province: "ON", phone: "416-658-1600", url: "https://costi.org", category: "Settlement Agencies", languages: ["English", "Spanish", "Italian"], hours: "Mon-Fri 9AM-5PM", lat: 43.6678, lng: -79.4385 },
  { name: "Catholic Centre for Immigrants - Ottawa", nameEs: "Centro Católico para Inmigrantes - Ottawa", address: "219 Argyle Ave", city: "Ottawa", province: "ON", phone: "613-232-9634", url: "", category: "Settlement Agencies", languages: ["English", "French", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.4100, lng: -75.6920 },
  { name: "YMCA of Greater Toronto - Newcomer Services", nameEs: "YMCA de Toronto - Servicios para Recién Llegados", address: "42 Charles St E", city: "Toronto", province: "ON", phone: "416-928-9622", url: "", category: "Settlement Agencies", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 43.6688, lng: -79.3849 },
  { name: "Thunder Bay Multicultural Association", nameEs: "Asociación Multicultural de Thunder Bay", address: "17 Court St N", city: "Thunder Bay", province: "ON", phone: "807-345-0551", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 48.3822, lng: -89.2477 },
  // NGOs
  { name: "FCJ Refugee Centre", nameEs: "Centro de Refugiados FCJ", address: "208 Oakwood Ave", city: "Toronto", province: "ON", phone: "416-469-9754", url: "", category: "NGOs", languages: ["English", "Spanish", "French"], hours: "Mon-Fri 9AM-5PM", lat: 43.6780, lng: -79.4280 },
  { name: "Canadian Centre for Gender and Sexual Diversity", nameEs: "Centro Canadiense de Diversidad de Género y Sexual", address: "251 Bank St", city: "Ottawa", province: "ON", phone: "613-400-1875", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 45.4180, lng: -75.6944 },
  { name: "Ontario Council of Agencies Serving Immigrants", nameEs: "Consejo de Ontario de Agencias al Servicio de Inmigrantes", address: "110 Eglinton Ave W", city: "Toronto", province: "ON", phone: "416-322-4950", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 43.7060, lng: -79.3998 },
  { name: "Amnesty International Canada", nameEs: "Amnistía Internacional Canadá", address: "312 Laurier Ave E", city: "Ottawa", province: "ON", phone: "613-744-7667", url: "https://amnesty.ca", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 45.4250, lng: -75.6790 },
  { name: "Colour of Poverty - Colour of Change", nameEs: "Color de la Pobreza - Color del Cambio", address: "215 Spadina Ave", city: "Toronto", province: "ON", phone: "416-792-1917", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 10AM-5PM", lat: 43.6510, lng: -79.3960 },
  // Government Services
  { name: "Ontario Human Rights Tribunal", nameEs: "Tribunal de Derechos Humanos de Ontario", address: "655 Bay St", city: "Toronto", province: "ON", phone: "1-866-598-0322", url: "http://www.hrto.ca", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-5PM", lat: 43.6590, lng: -79.3854 },
  { name: "Ontario Human Rights Commission", nameEs: "Comisión de Derechos Humanos de Ontario", address: "180 Dundas St W", city: "Toronto", province: "ON", phone: "416-326-9511", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-5PM", lat: 43.6540, lng: -79.3832 },
  { name: "Service Ontario - Hamilton", nameEs: "Servicio Ontario - Hamilton", address: "119 King St W", city: "Hamilton", province: "ON", phone: "1-888-745-8888", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 43.2566, lng: -79.8744 },
  { name: "Immigration, Refugees and Citizenship Canada - Ottawa", nameEs: "Inmigración, Refugiados y Ciudadanía Canadá - Ottawa", address: "365 Laurier Ave W", city: "Ottawa", province: "ON", phone: "1-888-242-2100", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4PM", lat: 45.4200, lng: -75.7080 },
  { name: "Ontario Workplace Safety and Insurance Board", nameEs: "Junta de Seguridad y Seguros en el Trabajo de Ontario", address: "200 Front St W", city: "Toronto", province: "ON", phone: "416-344-1000", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8AM-5PM", lat: 43.6445, lng: -79.3873 },
  // Disability Support
  { name: "ARCH Disability Law Centre", nameEs: "Centro Legal de Discapacidad ARCH", address: "55 University Ave", city: "Toronto", province: "ON", phone: "416-482-8255", url: "https://archdisabilitylaw.ca", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 43.6498, lng: -79.3856 },
  { name: "March of Dimes Canada", nameEs: "Marcha de los Dimes Canadá", address: "10 Overlea Blvd", city: "Toronto", province: "ON", phone: "416-425-3463", url: "https://marchofdimes.ca", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 43.7043, lng: -79.3474 },
  { name: "Independent Living Centre Kingston", nameEs: "Centro de Vida Independiente Kingston", address: "694 Bagot St", city: "Kingston", province: "ON", phone: "613-542-8353", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 44.2328, lng: -76.4936 },
  { name: "Ottawa-Carleton Association for Persons with Developmental Disabilities", nameEs: "Asociación Ottawa-Carleton para Personas con Discapacidades del Desarrollo", address: "2720 Richmond Rd", city: "Ottawa", province: "ON", phone: "613-569-8993", url: "", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.3530, lng: -75.7920 },
  { name: "Centre for Independent Living in Toronto", nameEs: "Centro para Vida Independiente en Toronto", address: "365 Bloor St E", city: "Toronto", province: "ON", phone: "416-599-2458", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 43.6708, lng: -79.3743 },
  // Workers' Rights
  { name: "ACCES Employment", nameEs: "ACCES Empleo", address: "489 College St", city: "Toronto", province: "ON", phone: "416-921-1800", url: "https://accesemployment.ca", category: "Workers' Rights", languages: ["English", "French", "Spanish"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 43.6560, lng: -79.4080 },
  { name: "Workers' Action Centre", nameEs: "Centro de Acción para Trabajadores", address: "720 Spadina Ave", city: "Toronto", province: "ON", phone: "416-531-0778", url: "", category: "Workers' Rights", languages: ["English", "Spanish"], hours: "Mon-Fri 10AM-5PM", lat: 43.6640, lng: -79.4040 },
  { name: "Ontario Federation of Labour", nameEs: "Federación del Trabajo de Ontario", address: "15 Gervais Dr", city: "Toronto", province: "ON", phone: "416-441-2731", url: "", category: "Workers' Rights", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 43.7465, lng: -79.3432 },
  { name: "Workers' Health and Safety Legal Clinic", nameEs: "Clínica Legal de Salud y Seguridad de los Trabajadores", address: "180 Dundas St W", city: "Toronto", province: "ON", phone: "416-971-8832", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 43.6540, lng: -79.3835 },
  { name: "Migrant Workers Alliance for Change", nameEs: "Alianza de Trabajadores Migrantes para el Cambio", address: "720 Bathurst St", city: "Toronto", province: "ON", phone: "416-909-7184", url: "", category: "Workers' Rights", languages: ["English", "Spanish", "Tagalog"], hours: "Mon-Fri 10AM-6PM", lat: 43.6640, lng: -79.4110 },
  // Shelters & Crisis
  { name: "Sojourn House", nameEs: "Casa Sojourn", address: "101 Ontario St", city: "Toronto", province: "ON", phone: "416-864-9136", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 43.6580, lng: -79.3640 },
  { name: "Red Door Family Shelter", nameEs: "Refugio Familiar Puerta Roja", address: "21 Millgate Rd", city: "Toronto", province: "ON", phone: "416-915-5671", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 43.6890, lng: -79.3530 },
  { name: "Eva's Initiatives", nameEs: "Iniciativas de Eva", address: "401 Richmond St W", city: "Toronto", province: "ON", phone: "416-867-0443", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 43.6494, lng: -79.3946 },
  { name: "Cornerstone Housing for Women - Ottawa", nameEs: "Cornerstone Vivienda para Mujeres - Ottawa", address: "412 MacLaren St", city: "Ottawa", province: "ON", phone: "613-254-6584", url: "", category: "Shelters & Crisis", languages: ["English", "French"], hours: "24/7", lat: 45.4142, lng: -75.6930 },
  { name: "Mission Services of Hamilton", nameEs: "Servicios Misioneros de Hamilton", address: "196 Wentworth St N", city: "Hamilton", province: "ON", phone: "905-528-7635", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 43.2580, lng: -79.8595 },

  // ===== BRITISH COLUMBIA =====
  // Legal Clinics
  { name: "Access Pro Bono", nameEs: "Access Pro Bono", address: "300-1140 W Pender St", city: "Vancouver", province: "BC", phone: "604-878-7400", url: "https://accessprobono.ca", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 49.2877, lng: -123.1180 },
  { name: "Legal Services Society BC", nameEs: "Sociedad de Servicios Legales BC", address: "400-510 Burrard St", city: "Vancouver", province: "BC", phone: "604-601-6000", url: "", category: "Legal Clinics", languages: ["English", "French", "Mandarin"], hours: "Mon-Fri 9AM-5PM", lat: 49.2846, lng: -123.1187 },
  { name: "Kelowna Community Legal Clinic", nameEs: "Clínica Legal Comunitaria de Kelowna", address: "1526 Ellis St", city: "Kelowna", province: "BC", phone: "250-762-3233", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 49.8863, lng: -119.4960 },
  { name: "Victoria Immigrant and Refugee Centre Society - Legal", nameEs: "Sociedad del Centro de Inmigrantes y Refugiados de Victoria - Legal", address: "535 Yates St", city: "Victoria", province: "BC", phone: "250-361-9433", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 48.4262, lng: -123.3626 },
  { name: "Surrey Community Legal Clinic", nameEs: "Clínica Legal Comunitaria de Surrey", address: "7337 137 St", city: "Surrey", province: "BC", phone: "604-572-7447", url: "", category: "Legal Clinics", languages: ["English", "Punjabi"], hours: "Mon-Fri 9AM-4:30PM", lat: 49.1331, lng: -122.8450 },
  // Settlement Agencies
  { name: "MOSAIC", nameEs: "MOSAIC", address: "1720 Grant St", city: "Vancouver", province: "BC", phone: "604-254-9626", url: "https://mosaicbc.org", category: "Settlement Agencies", languages: ["English", "Spanish", "Mandarin"], hours: "Mon-Fri 9AM-5PM", lat: 49.2764, lng: -123.0650 },
  { name: "ISSofBC", nameEs: "ISSofBC", address: "530 Drake St", city: "Vancouver", province: "BC", phone: "604-684-7498", url: "https://issbc.org", category: "Settlement Agencies", languages: ["English", "Mandarin", "Arabic"], hours: "Mon-Fri 9AM-5PM", lat: 49.2760, lng: -123.1210 },
  { name: "Kamloops Immigrant Services", nameEs: "Servicios para Inmigrantes de Kamloops", address: "428 Tranquille Rd", city: "Kamloops", province: "BC", phone: "250-372-0855", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 50.6817, lng: -120.3487 },
  { name: "Inter-Cultural Association of Greater Victoria", nameEs: "Asociación Intercultural de Greater Victoria", address: "930 Balmoral Rd", city: "Victoria", province: "BC", phone: "250-388-4728", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 48.4348, lng: -123.3569 },
  { name: "Abbotsford Community Services", nameEs: "Servicios Comunitarios de Abbotsford", address: "2420 Montrose Ave", city: "Abbotsford", province: "BC", phone: "604-859-7681", url: "", category: "Settlement Agencies", languages: ["English", "Punjabi"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.0504, lng: -122.3045 },
  // NGOs
  { name: "BC Civil Liberties Association", nameEs: "Asociación de Libertades Civiles de BC", address: "900-1281 W Georgia St", city: "Vancouver", province: "BC", phone: "604-687-2919", url: "https://bccla.org", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.2870, lng: -123.1260 },
  { name: "Pivot Legal Society", nameEs: "Sociedad Legal Pivot", address: "121 Heatley Ave", city: "Vancouver", province: "BC", phone: "604-255-9700", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.2810, lng: -123.0950 },
  { name: "West Coast LEAF", nameEs: "West Coast LEAF", address: "555 W Georgia St", city: "Vancouver", province: "BC", phone: "604-684-8772", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.2820, lng: -123.1180 },
  { name: "BC Refugee Hub", nameEs: "Centro de Refugiados de BC", address: "460 Nanaimo St", city: "Vancouver", province: "BC", phone: "604-254-5015", url: "", category: "NGOs", languages: ["English", "Arabic", "Dari"], hours: "Mon-Fri 9AM-4:30PM", lat: 49.2730, lng: -123.0660 },
  // Government Services
  { name: "BC Human Rights Tribunal", nameEs: "Tribunal de Derechos Humanos de BC", address: "1170-605 Robson St", city: "Vancouver", province: "BC", phone: "604-775-2000", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.2826, lng: -123.1207 },
  { name: "Service BC - Victoria", nameEs: "Servicio BC - Victoria", address: "800 Johnson St", city: "Victoria", province: "BC", phone: "250-387-6121", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 48.4300, lng: -123.3680 },
  { name: "WorkSafeBC", nameEs: "WorkSafeBC", address: "6951 Westminster Hwy", city: "Richmond", province: "BC", phone: "604-276-3100", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8AM-5PM", lat: 49.1695, lng: -123.1360 },
  { name: "BC Employment Standards Branch", nameEs: "Oficina de Normas de Empleo de BC", address: "400-4946 Canada Way", city: "Burnaby", province: "BC", phone: "1-800-663-3316", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.2265, lng: -123.0020 },
  // Disability Support
  { name: "Disability Alliance BC", nameEs: "Alianza de Discapacidad BC", address: "204-456 W Broadway", city: "Vancouver", province: "BC", phone: "604-875-0188", url: "https://disabilityalliancebc.org", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 49.2635, lng: -123.1150 },
  { name: "Neil Squire Society", nameEs: "Sociedad Neil Squire", address: "220-2250 Boundary Rd", city: "Burnaby", province: "BC", phone: "604-473-9363", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.2590, lng: -123.0240 },
  { name: "BC Centre for Ability", nameEs: "Centro de Habilidad de BC", address: "2805 Kingsway", city: "Vancouver", province: "BC", phone: "604-451-5511", url: "", category: "Disability Support", languages: ["English", "Mandarin"], hours: "Mon-Fri 8:30AM-5PM", lat: 49.2375, lng: -123.0400 },
  { name: "Inclusion BC", nameEs: "Inclusión BC", address: "227 6th St", city: "New Westminster", province: "BC", phone: "604-777-9100", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.2122, lng: -122.9127 },
  // Workers' Rights
  { name: "BC Federation of Labour", nameEs: "Federación del Trabajo de BC", address: "200-5118 Joyce St", city: "Vancouver", province: "BC", phone: "604-430-1421", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.2380, lng: -123.0280 },
  { name: "Migrant Workers Centre", nameEs: "Centro de Trabajadores Migrantes", address: "302-119 W Pender St", city: "Vancouver", province: "BC", phone: "604-669-4482", url: "", category: "Workers' Rights", languages: ["English", "Tagalog", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 49.2817, lng: -123.1070 },
  { name: "Together Against Poverty Society", nameEs: "Juntos Contra la Pobreza", address: "302-895 Fort St", city: "Victoria", province: "BC", phone: "250-361-3521", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 48.4232, lng: -123.3579 },
  { name: "Workers' Compensation Advocacy Group BC", nameEs: "Grupo de Defensa de Compensación de Trabajadores BC", address: "815 W Hastings St", city: "Vancouver", province: "BC", phone: "604-868-4520", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.2856, lng: -123.1140 },
  // Shelters & Crisis
  { name: "Union Gospel Mission", nameEs: "Misión Evangelio de la Unión", address: "601 E Hastings St", city: "Vancouver", province: "BC", phone: "604-253-3323", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.2817, lng: -123.0940 },
  { name: "Victoria Cool Aid Society", nameEs: "Sociedad Cool Aid de Victoria", address: "525 Ellice St", city: "Victoria", province: "BC", phone: "250-383-1977", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 48.4350, lng: -123.3720 },
  { name: "Kelowna Gospel Mission", nameEs: "Misión Evangelio de Kelowna", address: "251 Leon Ave", city: "Kelowna", province: "BC", phone: "250-763-3737", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.8871, lng: -119.4930 },
  { name: "Lookout Housing and Health Society", nameEs: "Sociedad de Vivienda y Salud Lookout", address: "347 E Hastings St", city: "Vancouver", province: "BC", phone: "604-255-0340", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.2815, lng: -123.0990 },

  // ===== QUEBEC =====
  // Legal Clinics
  { name: "Commission des droits de la personne", nameEs: "Comisión de Derechos de la Persona", address: "360 rue Saint-Jacques", city: "Montréal", province: "QC", phone: "514-873-5146", url: "", category: "Government Services", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5020, lng: -73.5582 },
  { name: "Clinique juridique du Mile End", nameEs: "Clínica Jurídica de Mile End", address: "5265 ave du Parc", city: "Montréal", province: "QC", phone: "514-277-7223", url: "", category: "Legal Clinics", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5210, lng: -73.6095 },
  { name: "Centre communautaire juridique de Montréal", nameEs: "Centro Comunitario Jurídico de Montreal", address: "1 Notre-Dame St E", city: "Montréal", province: "QC", phone: "514-864-2111", url: "", category: "Legal Clinics", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5079, lng: -73.5560 },
  { name: "Clinique juridique de Québec", nameEs: "Clínica Jurídica de Quebec", address: "400 boul. Jean-Lesage", city: "Québec City", province: "QC", phone: "418-643-2688", url: "", category: "Legal Clinics", languages: ["French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.8155, lng: -71.2230 },
  { name: "Centre de justice de proximité de Laval", nameEs: "Centro de Justicia de Proximidad de Laval", address: "1800 boul. Le Corbusier", city: "Laval", province: "QC", phone: "450-988-2942", url: "", category: "Legal Clinics", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5610, lng: -73.7490 },
  { name: "Clinique juridique de Sherbrooke", nameEs: "Clínica Jurídica de Sherbrooke", address: "155 rue Belvédère N", city: "Sherbrooke", province: "QC", phone: "819-563-2237", url: "", category: "Legal Clinics", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.4010, lng: -71.8890 },
  // Settlement Agencies
  { name: "CARI St-Laurent", nameEs: "CARI St-Laurent", address: "1595 boul. de l'Avenir", city: "Montréal", province: "QC", phone: "514-748-2007", url: "", category: "Settlement Agencies", languages: ["French", "English", "Spanish"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5120, lng: -73.6710 },
  { name: "Accueil liaison pour arrivants", nameEs: "Acogida y enlace para recién llegados", address: "1490 boul. de Maisonneuve W", city: "Montréal", province: "QC", phone: "514-737-2214", url: "", category: "Settlement Agencies", languages: ["French", "English", "Arabic"], hours: "Mon-Fri 9AM-5PM", lat: 45.4940, lng: -73.5830 },
  { name: "Centre multiethnique de Québec", nameEs: "Centro Multiétnico de Quebec", address: "369 rue de la Couronne", city: "Québec City", province: "QC", phone: "418-687-9771", url: "", category: "Settlement Agencies", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.8150, lng: -71.2230 },
  { name: "PROMIS - Montréal", nameEs: "PROMIS - Montreal", address: "3333 chemin de la Côte-Ste-Catherine", city: "Montréal", province: "QC", phone: "514-345-1615", url: "", category: "Settlement Agencies", languages: ["French", "English", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 45.5070, lng: -73.6210 },
  { name: "Service d'aide aux Néo-Canadiens - Sherbrooke", nameEs: "Servicio de Ayuda a Nuevos Canadienses - Sherbrooke", address: "535 rue Short", city: "Sherbrooke", province: "QC", phone: "819-566-5373", url: "", category: "Settlement Agencies", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.4040, lng: -71.8860 },
  // NGOs
  { name: "Ligue des droits et libertés", nameEs: "Liga de Derechos y Libertades", address: "469 rue Jean-Talon W", city: "Montréal", province: "QC", phone: "514-849-7717", url: "", category: "NGOs", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5330, lng: -73.6180 },
  { name: "Centre de recherche-action sur les relations raciales", nameEs: "Centro de Investigación-Acción sobre Relaciones Raciales", address: "460 rue Sainte-Catherine W", city: "Montréal", province: "QC", phone: "514-939-3342", url: "", category: "NGOs", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5057, lng: -73.5725 },
  { name: "Table de concertation des organismes au service des réfugiés", nameEs: "Mesa de Concertación de Organizaciones al Servicio de los Refugiados", address: "518 rue Beaubien E", city: "Montréal", province: "QC", phone: "514-272-6060", url: "", category: "NGOs", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5360, lng: -73.5920 },
  { name: "Amnistie internationale - Section Québec", nameEs: "Amnistía Internacional - Sección Quebec", address: "50 rue Sainte-Catherine W", city: "Montréal", province: "QC", phone: "514-766-9766", url: "", category: "NGOs", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5083, lng: -73.5676 },
  // Government Services
  { name: "Tribunal administratif du Québec", nameEs: "Tribunal Administrativo de Quebec", address: "575 rue Saint-Amable", city: "Québec City", province: "QC", phone: "418-643-3418", url: "", category: "Government Services", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.8110, lng: -71.2140 },
  { name: "Ministère de l'Immigration du Québec", nameEs: "Ministerio de Inmigración de Quebec", address: "360 rue McGill", city: "Montréal", province: "QC", phone: "514-864-9191", url: "", category: "Government Services", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5020, lng: -73.5550 },
  { name: "CNESST - Montréal", nameEs: "CNESST - Montreal", address: "1199 rue De Bleury", city: "Montréal", province: "QC", phone: "1-844-838-0808", url: "", category: "Government Services", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5100, lng: -73.5665 },
  { name: "Bureau des droits de la personne - Gatineau", nameEs: "Oficina de Derechos de la Persona - Gatineau", address: "170 rue de l'Hôtel-de-Ville", city: "Gatineau", province: "QC", phone: "819-772-3003", url: "", category: "Government Services", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.4275, lng: -75.7149 },
  // Disability Support
  { name: "OPHQ - Office des personnes handicapées du Québec", nameEs: "OPHQ - Oficina de Personas con Discapacidad de Quebec", address: "309 rue Brock", city: "Drummondville", province: "QC", phone: "1-800-567-1465", url: "", category: "Disability Support", languages: ["French", "English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.8838, lng: -72.4843 },
  { name: "Alliance québécoise des regroupements régionaux pour l'intégration des personnes handicapées", nameEs: "Alianza Quebequense para la Integración de Personas con Discapacidad", address: "533 rue Ontario E", city: "Montréal", province: "QC", phone: "514-237-2433", url: "", category: "Disability Support", languages: ["French"], hours: "Mon-Fri 9AM-5PM", lat: 45.5170, lng: -73.5590 },
  { name: "Regroupement des aveugles et amblyopes du Montréal", nameEs: "Agrupación de Ciegos y Ambliopes de Montreal", address: "5215 rue Berri", city: "Montréal", province: "QC", phone: "514-277-4401", url: "", category: "Disability Support", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5240, lng: -73.5835 },
  { name: "Comité d'action des personnes vivant des situations de handicap", nameEs: "Comité de Acción de Personas con Discapacidad", address: "105 boul. Charest E", city: "Québec City", province: "QC", phone: "418-523-6tried", url: "", category: "Disability Support", languages: ["French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.8130, lng: -71.2170 },
  // Workers' Rights
  { name: "Au bas de l'échelle", nameEs: "Al Pie de la Escalera", address: "6839-A rue Drolet", city: "Montréal", province: "QC", phone: "514-270-7878", url: "", category: "Workers' Rights", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 45.5380, lng: -73.5950 },
  { name: "Centre des travailleurs et travailleuses immigrants", nameEs: "Centro de Trabajadores Inmigrantes", address: "4755 ave Van Horne", city: "Montréal", province: "QC", phone: "514-342-2111", url: "", category: "Workers' Rights", languages: ["French", "English", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 45.5150, lng: -73.6260 },
  { name: "Centrale des syndicats du Québec", nameEs: "Central de Sindicatos de Quebec", address: "9405 rue Sherbrooke E", city: "Montréal", province: "QC", phone: "514-356-8888", url: "", category: "Workers' Rights", languages: ["French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.5670, lng: -73.5170 },
  { name: "Front de défense des non-syndiqué-e-s", nameEs: "Frente de Defensa de los No Sindicalizados", address: "6839 rue Drolet", city: "Montréal", province: "QC", phone: "514-271-2242", url: "", category: "Workers' Rights", languages: ["French"], hours: "Mon-Fri 9AM-5PM", lat: 45.5382, lng: -73.5952 },
  // Shelters & Crisis
  { name: "Welcome Hall Mission", nameEs: "Misión Welcome Hall", address: "606 rue De Courcelle", city: "Montréal", province: "QC", phone: "514-935-5964", url: "", category: "Shelters & Crisis", languages: ["French", "English"], hours: "24/7", lat: 45.4820, lng: -73.5870 },
  { name: "Old Brewery Mission", nameEs: "Misión Old Brewery", address: "915 rue Clark", city: "Montréal", province: "QC", phone: "514-866-6591", url: "", category: "Shelters & Crisis", languages: ["French", "English"], hours: "24/7", lat: 45.5100, lng: -73.5615 },
  { name: "Maison Dauphine - Québec", nameEs: "Casa Dauphine - Quebec", address: "42 rue Dauphine", city: "Québec City", province: "QC", phone: "418-694-9616", url: "", category: "Shelters & Crisis", languages: ["French"], hours: "24/7", lat: 46.8140, lng: -71.2080 },
  { name: "Le Gîte Ami - Sherbrooke", nameEs: "El Refugio Amigo - Sherbrooke", address: "117 rue Wellington N", city: "Sherbrooke", province: "QC", phone: "819-569-9839", url: "", category: "Shelters & Crisis", languages: ["French", "English"], hours: "24/7", lat: 45.4050, lng: -71.8920 },

  // ===== ALBERTA =====
  // Legal Clinics
  { name: "Calgary Legal Guidance", nameEs: "Guía Legal de Calgary", address: "840 7 Ave SW", city: "Calgary", province: "AB", phone: "403-234-9266", url: "https://clg.ab.ca", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 51.0456, lng: -114.0780 },
  { name: "Edmonton Community Legal Centre", nameEs: "Centro Legal Comunitario de Edmonton", address: "9913 108 Ave", city: "Edmonton", province: "AB", phone: "780-702-1725", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 53.5490, lng: -113.5060 },
  { name: "Student Legal Services Edmonton", nameEs: "Servicios Legales Estudiantiles Edmonton", address: "11011 Saskatchewan Dr", city: "Edmonton", province: "AB", phone: "780-492-8244", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 53.5266, lng: -113.5218 },
  { name: "Legal Aid Alberta - Red Deer", nameEs: "Ayuda Legal Alberta - Red Deer", address: "4909 49 St", city: "Red Deer", province: "AB", phone: "403-340-5187", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.2665, lng: -113.8110 },
  { name: "Pro Bono Law Alberta", nameEs: "Ley Pro Bono Alberta", address: "100 7th Ave SW", city: "Calgary", province: "AB", phone: "403-541-4804", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 51.0445, lng: -114.0665 },
  // Settlement Agencies
  { name: "Action for Healthy Communities", nameEs: "Acción para Comunidades Saludables", address: "10578 113 St NW", city: "Edmonton", province: "AB", phone: "780-421-2870", url: "", category: "Settlement Agencies", languages: ["English", "Spanish", "French"], hours: "Mon-Fri 9AM-4:30PM", lat: 53.5390, lng: -113.5110 },
  { name: "Calgary Catholic Immigration Society", nameEs: "Sociedad Católica de Inmigración de Calgary", address: "120 17 Ave SW", city: "Calgary", province: "AB", phone: "403-262-2006", url: "", category: "Settlement Agencies", languages: ["English", "Arabic", "Spanish"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 51.0372, lng: -114.0650 },
  { name: "Edmonton Mennonite Centre for Newcomers", nameEs: "Centro Menonita de Edmonton para Recién Llegados", address: "11713 82 St NW", city: "Edmonton", province: "AB", phone: "780-424-7709", url: "", category: "Settlement Agencies", languages: ["English", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 53.5620, lng: -113.4570 },
  { name: "Immigrant Services Calgary", nameEs: "Servicios para Inmigrantes Calgary", address: "1200 910 7 Ave SW", city: "Calgary", province: "AB", phone: "403-265-1120", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 51.0455, lng: -114.0750 },
  { name: "Lethbridge Family Services", nameEs: "Servicios Familiares de Lethbridge", address: "1107 2 Ave A N", city: "Lethbridge", province: "AB", phone: "403-327-6681", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.6956, lng: -112.8326 },
  // NGOs
  { name: "Alberta Civil Liberties Research Centre", nameEs: "Centro de Investigación de Libertades Civiles de Alberta", address: "2500 University Dr NW", city: "Calgary", province: "AB", phone: "403-220-2505", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 51.0770, lng: -114.1290 },
  { name: "Edmonton Social Planning Council", nameEs: "Consejo de Planificación Social de Edmonton", address: "10050 112 St NW", city: "Edmonton", province: "AB", phone: "780-423-2031", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 53.5410, lng: -113.5050 },
  { name: "Action Dignity", nameEs: "Acción Dignidad", address: "301-301 14 St NW", city: "Calgary", province: "AB", phone: "403-263-5580", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 51.0500, lng: -114.0940 },
  { name: "Alberta Association of Immigrant Serving Agencies", nameEs: "Asociación de Agencias de Servicios para Inmigrantes de Alberta", address: "11010 101 St NW", city: "Edmonton", province: "AB", phone: "780-421-2862", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 53.5450, lng: -113.5010 },
  // Government Services
  { name: "Alberta Human Rights Commission", nameEs: "Comisión de Derechos Humanos de Alberta", address: "800 Standard Life Centre", city: "Edmonton", province: "AB", phone: "780-427-7661", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:15AM-4:30PM", lat: 53.5410, lng: -113.4930 },
  { name: "Alberta Employment Standards", nameEs: "Normas de Empleo de Alberta", address: "7th Floor 10808 99 Ave", city: "Edmonton", province: "AB", phone: "780-427-3731", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:15AM-4:30PM", lat: 53.5400, lng: -113.4950 },
  { name: "Service Alberta - Calgary", nameEs: "Servicio Alberta - Calgary", address: "212 4 Ave SE", city: "Calgary", province: "AB", phone: "403-297-6251", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:15AM-4:30PM", lat: 51.0465, lng: -114.0585 },
  { name: "Alberta Occupational Health and Safety", nameEs: "Salud y Seguridad Ocupacional de Alberta", address: "10808 99 Ave NW", city: "Edmonton", province: "AB", phone: "780-415-8690", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:15AM-4:30PM", lat: 53.5402, lng: -113.4955 },
  // Disability Support
  { name: "Disability Action Hall", nameEs: "Salón de Acción para la Discapacidad", address: "3 Sir Winston Churchill Sq", city: "Edmonton", province: "AB", phone: "780-488-9088", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 53.5444, lng: -113.4909 },
  { name: "Alberta Ability Network", nameEs: "Red de Habilidad de Alberta", address: "600-10055 106 St NW", city: "Edmonton", province: "AB", phone: "780-454-6526", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 53.5400, lng: -113.4980 },
  { name: "Calgary Scope Society", nameEs: "Sociedad Scope de Calgary", address: "3820 24 Ave NW", city: "Calgary", province: "AB", phone: "403-282-5663", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 51.0710, lng: -114.0890 },
  { name: "Gateway Association", nameEs: "Asociación Gateway", address: "11016 127 St NW", city: "Edmonton", province: "AB", phone: "780-454-0701", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4PM", lat: 53.5640, lng: -113.5350 },
  // Workers' Rights
  { name: "Alberta Federation of Labour", nameEs: "Federación del Trabajo de Alberta", address: "10408 124 St NW", city: "Edmonton", province: "AB", phone: "780-483-3021", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 53.5460, lng: -113.5320 },
  { name: "Calgary Workers' Resource Centre", nameEs: "Centro de Recursos para Trabajadores de Calgary", address: "315 10 Ave SE", city: "Calgary", province: "AB", phone: "403-264-8100", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 51.0420, lng: -114.0540 },
  { name: "Migrante Alberta", nameEs: "Migrante Alberta", address: "10554 110 St NW", city: "Edmonton", province: "AB", phone: "780-993-7272", url: "", category: "Workers' Rights", languages: ["English", "Tagalog", "Spanish"], hours: "Mon-Fri 10AM-5PM", lat: 53.5435, lng: -113.5070 },
  { name: "Action for Healthy Communities - Workers Program", nameEs: "Acción para Comunidades Saludables - Programa de Trabajadores", address: "10578 113 St NW", city: "Edmonton", province: "AB", phone: "780-421-2870", url: "", category: "Workers' Rights", languages: ["English", "Spanish"], hours: "Mon-Fri 9AM-4:30PM", lat: 53.5392, lng: -113.5112 },
  // Shelters & Crisis
  { name: "Calgary Drop-In Centre", nameEs: "Centro de Acogida de Calgary", address: "1 Dermot Baldwin Way SE", city: "Calgary", province: "AB", phone: "403-266-3600", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 51.0415, lng: -114.0555 },
  { name: "Hope Mission Edmonton", nameEs: "Misión Esperanza Edmonton", address: "9908 106 Ave NW", city: "Edmonton", province: "AB", phone: "780-422-2018", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 53.5485, lng: -113.5010 },
  { name: "Mustard Seed Calgary", nameEs: "Semilla de Mostaza Calgary", address: "102 11 Ave SE", city: "Calgary", province: "AB", phone: "403-269-1319", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 51.0405, lng: -114.0600 },
  { name: "Edmonton Women's Shelter", nameEs: "Refugio para Mujeres de Edmonton", address: "10310 110 St NW", city: "Edmonton", province: "AB", phone: "780-423-5302", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 53.5430, lng: -113.5060 },

  // ===== MANITOBA =====
  // Legal Clinics
  { name: "Legal Aid Manitoba", nameEs: "Ayuda Legal Manitoba", address: "402-294 Portage Ave", city: "Winnipeg", province: "MB", phone: "204-985-8500", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8915, lng: -97.1470 },
  { name: "Community Legal Education Association", nameEs: "Asociación de Educación Legal Comunitaria", address: "205-414 Graham Ave", city: "Winnipeg", province: "MB", phone: "204-943-2382", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.8865, lng: -97.1470 },
  { name: "A&O Legal Services for Seniors", nameEs: "Servicios Legales A&O para Personas Mayores", address: "200-323 Portage Ave", city: "Winnipeg", province: "MB", phone: "204-956-6440", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8910, lng: -97.1480 },
  { name: "University of Manitoba Community Law Centre", nameEs: "Centro de Derecho Comunitario de la Universidad de Manitoba", address: "224 Dysart Rd", city: "Winnipeg", province: "MB", phone: "204-474-6173", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 49.8077, lng: -97.1370 },
  // Settlement Agencies
  { name: "Manitoba Interfaith Immigration Council", nameEs: "Consejo Interreligioso de Inmigración de Manitoba", address: "400 Edmonton St", city: "Winnipeg", province: "MB", phone: "204-977-1000", url: "", category: "Settlement Agencies", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8850, lng: -97.1370 },
  { name: "Immigrant and Refugee Community Organization of Manitoba", nameEs: "Organización Comunitaria de Inmigrantes y Refugiados de Manitoba", address: "100 Adelaide St", city: "Winnipeg", province: "MB", phone: "204-943-8765", url: "", category: "Settlement Agencies", languages: ["English", "Arabic", "Swahili"], hours: "Mon-Fri 9AM-5PM", lat: 49.8820, lng: -97.1350 },
  { name: "NEEDS Centre", nameEs: "Centro NEEDS", address: "251 Notre Dame Ave", city: "Winnipeg", province: "MB", phone: "204-940-1260", url: "", category: "Settlement Agencies", languages: ["English", "Tigrinya", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8930, lng: -97.1530 },
  { name: "Brandon Neighbourhood Renewal Corporation", nameEs: "Corporación de Renovación del Vecindario de Brandon", address: "520 Richmond Ave", city: "Brandon", province: "MB", phone: "204-571-0579", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.8423, lng: -99.9507 },
  // NGOs
  { name: "Canadian Centre for Policy Alternatives - Manitoba", nameEs: "Centro Canadiense para Alternativas de Políticas - Manitoba", address: "301-583 Ellice Ave", city: "Winnipeg", province: "MB", phone: "204-927-3200", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.8860, lng: -97.1610 },
  { name: "Social Planning Council of Winnipeg", nameEs: "Consejo de Planificación Social de Winnipeg", address: "432 Ellice Ave", city: "Winnipeg", province: "MB", phone: "204-943-2561", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8870, lng: -97.1560 },
  { name: "Manitoba Association for Rights and Liberties", nameEs: "Asociación de Manitoba para Derechos y Libertades", address: "180 King St", city: "Winnipeg", province: "MB", phone: "204-943-4658", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 49.8940, lng: -97.1370 },
  { name: "Welcome Place Manitoba", nameEs: "Welcome Place Manitoba", address: "521 Bannatyne Ave", city: "Winnipeg", province: "MB", phone: "204-977-1000", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8950, lng: -97.1520 },
  // Government Services
  { name: "Manitoba Human Rights Commission", nameEs: "Comisión de Derechos Humanos de Manitoba", address: "175 Hargrave St", city: "Winnipeg", province: "MB", phone: "204-945-3007", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8890, lng: -97.1430 },
  { name: "Manitoba Employment Standards", nameEs: "Normas de Empleo de Manitoba", address: "614-401 York Ave", city: "Winnipeg", province: "MB", phone: "204-945-3352", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8880, lng: -97.1460 },
  { name: "Manitoba Workplace Safety and Health", nameEs: "Seguridad y Salud en el Trabajo de Manitoba", address: "200-401 York Ave", city: "Winnipeg", province: "MB", phone: "204-945-3446", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8882, lng: -97.1462 },
  { name: "Manitoba Immigration and Economic Opportunities", nameEs: "Inmigración y Oportunidades Económicas de Manitoba", address: "213 Notre Dame Ave", city: "Winnipeg", province: "MB", phone: "204-945-3456", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8935, lng: -97.1510 },
  // Disability Support
  { name: "Inclusion Winnipeg", nameEs: "Inclusión Winnipeg", address: "120-30 Fort St", city: "Winnipeg", province: "MB", phone: "204-786-1414", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8960, lng: -97.1370 },
  { name: "Independent Living Resource Centre", nameEs: "Centro de Recursos para Vida Independiente", address: "311-393 Portage Ave", city: "Winnipeg", province: "MB", phone: "204-947-0194", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.8905, lng: -97.1500 },
  { name: "Manitoba League of Persons with Disabilities", nameEs: "Liga de Manitoba de Personas con Discapacidades", address: "105-500 Portage Ave", city: "Winnipeg", province: "MB", phone: "204-943-6099", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 49.8895, lng: -97.1530 },
  { name: "Society for Manitobans with Disabilities", nameEs: "Sociedad para Manitobanos con Discapacidades", address: "825 Sherbrook St", city: "Winnipeg", province: "MB", phone: "204-975-3010", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8AM-4:30PM", lat: 49.8910, lng: -97.1660 },
  // Workers' Rights
  { name: "Manitoba Federation of Labour", nameEs: "Federación del Trabajo de Manitoba", address: "303-275 Broadway", city: "Winnipeg", province: "MB", phone: "204-947-1400", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8870, lng: -97.1450 },
  { name: "Workers Organizing Resource Centre", nameEs: "Centro de Recursos para Organización de Trabajadores", address: "614 Arlington St", city: "Winnipeg", province: "MB", phone: "204-926-6520", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 49.8963, lng: -97.1730 },
  { name: "Immigrant Workers' Advocacy Network Manitoba", nameEs: "Red de Defensa de Trabajadores Inmigrantes Manitoba", address: "100 Adelaide St", city: "Winnipeg", province: "MB", phone: "204-943-1265", url: "", category: "Workers' Rights", languages: ["English", "Tagalog"], hours: "Mon-Fri 10AM-5PM", lat: 49.8822, lng: -97.1352 },
  { name: "Employment Projects of Winnipeg", nameEs: "Proyectos de Empleo de Winnipeg", address: "3rd Fl-290 Vaughan St", city: "Winnipeg", province: "MB", phone: "204-949-5300", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 49.8915, lng: -97.1500 },
  // Shelters & Crisis
  { name: "Siloam Mission", nameEs: "Misión Siloam", address: "300 Princess St", city: "Winnipeg", province: "MB", phone: "204-956-4344", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.8990, lng: -97.1460 },
  { name: "Main Street Project", nameEs: "Proyecto Calle Principal", address: "75 Martha St", city: "Winnipeg", province: "MB", phone: "204-982-8245", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.9000, lng: -97.1310 },
  { name: "Salvation Army Winnipeg", nameEs: "Ejército de Salvación Winnipeg", address: "180 Henry Ave", city: "Winnipeg", province: "MB", phone: "204-946-9400", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.9020, lng: -97.1430 },
  { name: "Willow Place Women's Shelter", nameEs: "Refugio para Mujeres Willow Place", address: "525 Wardlaw Ave", city: "Winnipeg", province: "MB", phone: "204-615-0313", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 49.8740, lng: -97.1430 },

  // ===== SASKATCHEWAN =====
  // Legal Clinics
  { name: "Legal Aid Saskatchewan - Regina", nameEs: "Ayuda Legal Saskatchewan - Regina", address: "502-201 21st St E", city: "Saskatoon", province: "SK", phone: "306-933-5300", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1279, lng: -106.6567 },
  { name: "Community Legal Assistance Services for Saskatoon Inner City", nameEs: "Servicios de Asistencia Legal Comunitaria de Saskatoon", address: "123 21st St E", city: "Saskatoon", province: "SK", phone: "306-653-1148", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 52.1280, lng: -106.6570 },
  { name: "Pro Bono Law Saskatchewan", nameEs: "Ley Pro Bono Saskatchewan", address: "1874 Scarth St", city: "Regina", province: "SK", phone: "306-569-3098", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 50.4505, lng: -104.6096 },
  { name: "Public Legal Education Association of Saskatchewan", nameEs: "Asociación de Educación Legal Pública de Saskatchewan", address: "300-201 21st St E", city: "Saskatoon", province: "SK", phone: "306-653-1868", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1282, lng: -106.6565 },
  // Settlement Agencies
  { name: "Regina Open Door Society", nameEs: "Sociedad Puertas Abiertas de Regina", address: "1855 Smith St", city: "Regina", province: "SK", phone: "306-352-3500", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 50.4540, lng: -104.6110 },
  { name: "Saskatoon Open Door Society", nameEs: "Sociedad Puertas Abiertas de Saskatoon", address: "247 1st Ave N", city: "Saskatoon", province: "SK", phone: "306-653-4464", url: "", category: "Settlement Agencies", languages: ["English", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1320, lng: -106.6680 },
  { name: "Moose Jaw Multicultural Council", nameEs: "Consejo Multicultural de Moose Jaw", address: "60 Athabasca St E", city: "Moose Jaw", province: "SK", phone: "306-693-4677", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 50.3919, lng: -105.5341 },
  { name: "Prince Albert Multicultural Council", nameEs: "Consejo Multicultural de Prince Albert", address: "125 12th St E", city: "Prince Albert", province: "SK", phone: "306-922-0890", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 53.2021, lng: -105.7534 },
  // NGOs
  { name: "Saskatchewan Human Rights Commission", nameEs: "Comisión de Derechos Humanos de Saskatchewan", address: "816 Idylwyld Dr N", city: "Saskatoon", province: "SK", phone: "306-933-5952", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8AM-5PM", lat: 52.1370, lng: -106.6740 },
  { name: "Saskatchewan Intercultural Association", nameEs: "Asociación Intercultural de Saskatchewan", address: "2331 11th Ave", city: "Regina", province: "SK", phone: "306-757-5990", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 50.4500, lng: -104.6180 },
  { name: "Canadian Mental Health Association - Saskatchewan", nameEs: "Asociación Canadiense de Salud Mental - Saskatchewan", address: "2702 12th Ave", city: "Regina", province: "SK", phone: "306-525-5601", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 50.4490, lng: -104.6220 },
  { name: "Newcomer Information Centre Saskatchewan", nameEs: "Centro de Información para Recién Llegados Saskatchewan", address: "3510 5th Ave", city: "Regina", province: "SK", phone: "306-596-2525", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 50.4470, lng: -104.5960 },
  // Government Services
  { name: "Saskatchewan Employment Standards", nameEs: "Normas de Empleo de Saskatchewan", address: "1870 Albert St", city: "Regina", province: "SK", phone: "306-787-2438", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8AM-5PM", lat: 50.4520, lng: -104.6130 },
  { name: "Workers' Compensation Board of Saskatchewan", nameEs: "Junta de Compensación de Trabajadores de Saskatchewan", address: "200-1881 Scarth St", city: "Regina", province: "SK", phone: "306-787-4370", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8AM-5PM", lat: 50.4510, lng: -104.6095 },
  { name: "Saskatchewan Occupational Health and Safety", nameEs: "Salud y Seguridad Ocupacional de Saskatchewan", address: "300-1870 Albert St", city: "Regina", province: "SK", phone: "306-787-4496", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8AM-5PM", lat: 50.4522, lng: -104.6132 },
  { name: "Service Saskatchewan - Saskatoon", nameEs: "Servicio Saskatchewan - Saskatoon", address: "122 3rd Ave N", city: "Saskatoon", province: "SK", phone: "306-933-6522", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8AM-5PM", lat: 52.1315, lng: -106.6650 },
  // Disability Support
  { name: "Saskatchewan Abilities Council", nameEs: "Consejo de Habilidades de Saskatchewan", address: "2310 Louise Ave", city: "Saskatoon", province: "SK", phone: "306-374-4448", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1200, lng: -106.6530 },
  { name: "Neil Chicken Chair Centre for Persons with Disabilities", nameEs: "Centro Neil Chicken para Personas con Discapacidades", address: "3031 Louise St", city: "Saskatoon", province: "SK", phone: "306-373-7712", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1150, lng: -106.6510 },
  { name: "South Saskatchewan Independent Living Centre", nameEs: "Centro de Vida Independiente del Sur de Saskatchewan", address: "3031 Faithfull Ave", city: "Saskatoon", province: "SK", phone: "306-665-5508", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 52.1300, lng: -106.6310 },
  { name: "Regina & District Association for Community Living", nameEs: "Asociación de Regina para la Vida Comunitaria", address: "2631 28th Ave", city: "Regina", province: "SK", phone: "306-790-5680", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 50.4360, lng: -104.5890 },
  // Workers' Rights
  { name: "Saskatchewan Federation of Labour", nameEs: "Federación del Trabajo de Saskatchewan", address: "220-2445 13th Ave", city: "Regina", province: "SK", phone: "306-525-0197", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 50.4480, lng: -104.6140 },
  { name: "Occupational Health Clinics - Saskatoon", nameEs: "Clínicas de Salud Ocupacional - Saskatoon", address: "239 Robin Crescent", city: "Saskatoon", province: "SK", phone: "306-655-4686", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1270, lng: -106.6500 },
  { name: "Immigrant Workers Support Centre SK", nameEs: "Centro de Apoyo a Trabajadores Inmigrantes SK", address: "2161 Scarth St", city: "Regina", province: "SK", phone: "306-924-8620", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 50.4480, lng: -104.6096 },
  { name: "UFCW Saskatchewan", nameEs: "UFCW Saskatchewan", address: "318 C Ave S", city: "Saskatoon", province: "SK", phone: "306-653-3650", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 52.1250, lng: -106.6700 },
  // Shelters & Crisis
  { name: "Salvation Army - Regina", nameEs: "Ejército de Salvación - Regina", address: "1845 Osler St", city: "Regina", province: "SK", phone: "306-569-6088", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 50.4560, lng: -104.6050 },
  { name: "Lighthouse Supported Living - Saskatoon", nameEs: "Lighthouse Vivienda Asistida - Saskatoon", address: "163 3rd Ave S", city: "Saskatoon", province: "SK", phone: "306-242-1311", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 52.1260, lng: -106.6680 },
  { name: "YWCA Regina", nameEs: "YWCA Regina", address: "1940 McIntyre St", city: "Regina", province: "SK", phone: "306-525-2141", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 50.4530, lng: -104.6080 },
  { name: "Interval House Saskatoon", nameEs: "Casa Intervalo Saskatoon", address: "Box 516", city: "Saskatoon", province: "SK", phone: "306-244-0185", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 52.1300, lng: -106.6700 },

  // ===== NOVA SCOTIA =====
  // Legal Clinics
  { name: "Halifax Refugee Clinic", nameEs: "Clínica de Refugiados de Halifax", address: "6169 Quinpool Rd", city: "Halifax", province: "NS", phone: "902-422-6736", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 44.6440, lng: -63.5930 },
  { name: "Nova Scotia Legal Aid - Dartmouth", nameEs: "Ayuda Legal de Nueva Escocia - Dartmouth", address: "277 Pleasant St", city: "Dartmouth", province: "NS", phone: "902-420-6583", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6660, lng: -63.5660 },
  { name: "Dalhousie Legal Aid Service", nameEs: "Servicio de Ayuda Legal Dalhousie", address: "6061 University Ave", city: "Halifax", province: "NS", phone: "902-423-8105", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 44.6365, lng: -63.5900 },
  { name: "Cape Breton Legal Aid", nameEs: "Ayuda Legal de Cape Breton", address: "325 Charlotte St", city: "Sydney", province: "NS", phone: "902-564-7771", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.1355, lng: -60.1940 },
  // Settlement Agencies
  { name: "Immigrant Services Association of Nova Scotia", nameEs: "Asociación de Servicios para Inmigrantes de Nueva Escocia", address: "6960 Mumford Rd", city: "Halifax", province: "NS", phone: "902-423-3607", url: "", category: "Settlement Agencies", languages: ["English", "Arabic", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6430, lng: -63.6120 },
  { name: "YMCA Centre for Immigrant Programs - Halifax", nameEs: "Centro YMCA para Programas de Inmigrantes - Halifax", address: "1239 Barrington St", city: "Halifax", province: "NS", phone: "902-457-9622", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 44.6470, lng: -63.5750 },
  { name: "Antigonish Women's Resource Centre", nameEs: "Centro de Recursos para Mujeres de Antigonish", address: "219 Main St", city: "Antigonish", province: "NS", phone: "902-863-6221", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 45.6233, lng: -61.9987 },
  { name: "Cape Breton Immigrant Settlement", nameEs: "Asentamiento de Inmigrantes de Cape Breton", address: "80 Nepean St", city: "Sydney", province: "NS", phone: "902-539-0700", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.1365, lng: -60.1910 },
  // NGOs
  { name: "Nova Scotia Human Rights Commission", nameEs: "Comisión de Derechos Humanos de Nueva Escocia", address: "5670 Spring Garden Rd", city: "Halifax", province: "NS", phone: "902-424-4111", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6400, lng: -63.5830 },
  { name: "YWCA Halifax", nameEs: "YWCA Halifax", address: "6169 Quinpool Rd", city: "Halifax", province: "NS", phone: "902-423-6162", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6442, lng: -63.5932 },
  { name: "Nova Scotia Association for Community Living", nameEs: "Asociación de Nueva Escocia para la Vida Comunitaria", address: "22 Harris Ave", city: "Truro", province: "NS", phone: "902-897-6550", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 45.3616, lng: -63.2798 },
  { name: "African Nova Scotian Affairs", nameEs: "Asuntos Afro-Novascocianos", address: "1741 Brunswick St", city: "Halifax", province: "NS", phone: "902-424-5555", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6520, lng: -63.5710 },
  // Government Services
  { name: "Nova Scotia Labour Standards", nameEs: "Normas Laborales de Nueva Escocia", address: "5151 Terminal Rd", city: "Halifax", province: "NS", phone: "902-424-4311", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6460, lng: -63.5710 },
  { name: "Nova Scotia Workers' Compensation Board", nameEs: "Junta de Compensación de Trabajadores de Nueva Escocia", address: "5668 South St", city: "Halifax", province: "NS", phone: "902-491-8999", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6360, lng: -63.5820 },
  { name: "Service Nova Scotia - Dartmouth", nameEs: "Servicio Nueva Escocia - Dartmouth", address: "33 Alderney Dr", city: "Dartmouth", province: "NS", phone: "902-424-5200", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6650, lng: -63.5680 },
  { name: "NS Office of Immigration", nameEs: "Oficina de Inmigración de NS", address: "1505 Barrington St", city: "Halifax", province: "NS", phone: "902-424-5230", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6430, lng: -63.5720 },
  // Disability Support
  { name: "Disability Rights Coalition of Nova Scotia", nameEs: "Coalición de Derechos de Discapacidad de Nueva Escocia", address: "5251 Duke St", city: "Halifax", province: "NS", phone: "902-429-0540", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 44.6450, lng: -63.5710 },
  { name: "Independent Living Nova Scotia", nameEs: "Vida Independiente Nueva Escocia", address: "2786 Agricola St", city: "Halifax", province: "NS", phone: "902-453-0004", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 44.6580, lng: -63.5890 },
  { name: "Canadian National Institute for the Blind - Halifax", nameEs: "Instituto Nacional Canadiense para Ciegos - Halifax", address: "6136 Almon St", city: "Halifax", province: "NS", phone: "902-453-1480", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6550, lng: -63.5920 },
  { name: "Autism Nova Scotia", nameEs: "Autismo Nueva Escocia", address: "5945 Spring Garden Rd", city: "Halifax", province: "NS", phone: "902-446-4995", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 44.6395, lng: -63.5860 },
  // Workers' Rights
  { name: "Nova Scotia Federation of Labour", nameEs: "Federación del Trabajo de Nueva Escocia", address: "3700 Kempt Rd", city: "Halifax", province: "NS", phone: "902-454-6735", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6590, lng: -63.6010 },
  { name: "Halifax Workers' Action Centre", nameEs: "Centro de Acción para Trabajadores de Halifax", address: "5663 Cornwallis St", city: "Halifax", province: "NS", phone: "902-405-4227", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 10AM-5PM", lat: 44.6530, lng: -63.5820 },
  { name: "Immigrant Workers Centre - Nova Scotia", nameEs: "Centro de Trabajadores Inmigrantes - Nueva Escocia", address: "6960 Mumford Rd", city: "Halifax", province: "NS", phone: "902-423-3610", url: "", category: "Workers' Rights", languages: ["English", "Arabic"], hours: "Mon-Fri 9AM-5PM", lat: 44.6432, lng: -63.6122 },
  { name: "United Food and Commercial Workers - Atlantic", nameEs: "Trabajadores de Alimentos y Comercio - Atlántico", address: "70 Woodlawn Rd", city: "Dartmouth", province: "NS", phone: "902-465-1288", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 44.6680, lng: -63.5540 },
  // Shelters & Crisis
  { name: "Metro Turning Point", nameEs: "Metro Turning Point", address: "2160 Barrington St", city: "Halifax", province: "NS", phone: "902-420-3282", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 44.6380, lng: -63.5740 },
  { name: "Bryony House", nameEs: "Casa Bryony", address: "Box 3545", city: "Halifax", province: "NS", phone: "902-423-7183", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 44.6460, lng: -63.5780 },
  { name: "Adsum House", nameEs: "Casa Adsum", address: "2421 Brunswick St", city: "Halifax", province: "NS", phone: "902-423-4443", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 44.6550, lng: -63.5740 },
  { name: "Salvation Army - Sydney", nameEs: "Ejército de Salvación - Sydney", address: "264 Charlotte St", city: "Sydney", province: "NS", phone: "902-564-5212", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 46.1360, lng: -60.1935 },

  // ===== NEW BRUNSWICK =====
  // Legal Clinics
  { name: "Legal Aid New Brunswick - Fredericton", nameEs: "Ayuda Legal Nuevo Brunswick - Fredericton", address: "371 Queen St", city: "Fredericton", province: "NB", phone: "506-444-2776", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9636, lng: -66.6431 },
  { name: "Legal Aid New Brunswick - Moncton", nameEs: "Ayuda Legal Nuevo Brunswick - Moncton", address: "97 Foundry St", city: "Moncton", province: "NB", phone: "506-853-7300", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.0878, lng: -64.7782 },
  { name: "Legal Aid New Brunswick - Saint John", nameEs: "Ayuda Legal Nuevo Brunswick - Saint John", address: "110 Charlotte St", city: "Saint John", province: "NB", phone: "506-633-6030", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.2733, lng: -66.0633 },
  { name: "UNB Law Clinic", nameEs: "Clínica Legal UNB", address: "41 Dineen Dr", city: "Fredericton", province: "NB", phone: "506-453-5191", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 9AM-4PM", lat: 45.9483, lng: -66.6408 },
  // Settlement Agencies
  { name: "Multicultural Association of Fredericton", nameEs: "Asociación Multicultural de Fredericton", address: "123 York St", city: "Fredericton", province: "NB", phone: "506-457-4038", url: "", category: "Settlement Agencies", languages: ["English", "French", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9630, lng: -66.6440 },
  { name: "MAGMA - Moncton", nameEs: "MAGMA - Moncton", address: "102 Lester Ave", city: "Moncton", province: "NB", phone: "506-858-9659", url: "", category: "Settlement Agencies", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.0870, lng: -64.7730 },
  { name: "Saint John YMCA Newcomer Services", nameEs: "YMCA Saint John Servicios para Recién Llegados", address: "191 Churchill Blvd", city: "Saint John", province: "NB", phone: "506-634-4921", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.2750, lng: -66.0790 },
  { name: "Bathurst Multicultural Association", nameEs: "Asociación Multicultural de Bathurst", address: "320 St Patrick St", city: "Bathurst", province: "NB", phone: "506-546-3510", url: "", category: "Settlement Agencies", languages: ["English", "French"], hours: "Mon-Fri 9AM-4:30PM", lat: 47.6190, lng: -65.6510 },
  // NGOs
  { name: "NB Human Rights Commission", nameEs: "Comisión de Derechos Humanos de NB", address: "751 Brunswick St", city: "Fredericton", province: "NB", phone: "506-453-2301", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9640, lng: -66.6350 },
  { name: "Common Front for Social Justice NB", nameEs: "Frente Común por la Justicia Social NB", address: "236 St George St", city: "Moncton", province: "NB", phone: "506-855-8977", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 46.0890, lng: -64.7720 },
  { name: "NB Multicultural Council", nameEs: "Consejo Multicultural de NB", address: "371 Queen St", city: "Fredericton", province: "NB", phone: "506-453-1091", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9638, lng: -66.6433 },
  { name: "Human Development Council - Saint John", nameEs: "Consejo de Desarrollo Humano - Saint John", address: "139 Prince Edward St", city: "Saint John", province: "NB", phone: "506-634-1673", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.2740, lng: -66.0620 },
  // Government Services
  { name: "WorkSafe NB", nameEs: "WorkSafe NB", address: "1 Portland St", city: "Saint John", province: "NB", phone: "506-632-2200", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.2780, lng: -66.0570 },
  { name: "NB Employment Standards", nameEs: "Normas de Empleo de NB", address: "Chestnut Complex 470 York St", city: "Fredericton", province: "NB", phone: "506-453-2725", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9660, lng: -66.6460 },
  { name: "Service New Brunswick - Moncton", nameEs: "Servicio Nuevo Brunswick - Moncton", address: "281 St George St", city: "Moncton", province: "NB", phone: "506-856-2000", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.0895, lng: -64.7710 },
  { name: "NB Immigration Office", nameEs: "Oficina de Inmigración de NB", address: "500 Beaverbrook Ct", city: "Fredericton", province: "NB", phone: "506-453-3981", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9570, lng: -66.6350 },
  // Disability Support
  { name: "NB Association for Community Living", nameEs: "Asociación de NB para la Vida Comunitaria", address: "800 Hanwell Rd", city: "Fredericton", province: "NB", phone: "506-453-4400", url: "", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9460, lng: -66.6780 },
  { name: "Ability NB", nameEs: "Habilidad NB", address: "440 Wilsey Rd", city: "Fredericton", province: "NB", phone: "506-462-9555", url: "", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9520, lng: -66.6310 },
  { name: "NB Premier's Council on Disabilities", nameEs: "Consejo del Premier de NB sobre Discapacidades", address: "Kings Place 440 King St", city: "Fredericton", province: "NB", phone: "506-444-3000", url: "", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9620, lng: -66.6390 },
  { name: "CNIB - Moncton", nameEs: "CNIB - Moncton", address: "68 Church St", city: "Moncton", province: "NB", phone: "506-857-8277", url: "", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.0910, lng: -64.7750 },
  // Workers' Rights
  { name: "NB Federation of Labour", nameEs: "Federación del Trabajo de NB", address: "96 Norwood Ave", city: "Moncton", province: "NB", phone: "506-857-2125", url: "", category: "Workers' Rights", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.0870, lng: -64.7790 },
  { name: "Migrant Worker Support Centre NB", nameEs: "Centro de Apoyo a Trabajadores Migrantes NB", address: "123 York St", city: "Fredericton", province: "NB", phone: "506-457-4040", url: "", category: "Workers' Rights", languages: ["English", "French", "Spanish"], hours: "Mon-Fri 9AM-5PM", lat: 45.9632, lng: -66.6442 },
  { name: "Employment Equity Centre NB", nameEs: "Centro de Equidad de Empleo NB", address: "236 St George St", city: "Moncton", province: "NB", phone: "506-855-8980", url: "", category: "Workers' Rights", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 46.0892, lng: -64.7722 },
  { name: "CUPE NB", nameEs: "CUPE NB", address: "850 Brunswick St", city: "Fredericton", province: "NB", phone: "506-453-2719", url: "", category: "Workers' Rights", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 45.9655, lng: -66.6340 },
  // Shelters & Crisis
  { name: "Fredericton Homeless Shelter", nameEs: "Refugio para Personas sin Hogar de Fredericton", address: "371 York St", city: "Fredericton", province: "NB", phone: "506-450-4948", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 45.9650, lng: -66.6450 },
  { name: "Outflow Ministry - Saint John", nameEs: "Ministerio Outflow - Saint John", address: "175 Prince William St", city: "Saint John", province: "NB", phone: "506-642-7674", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 45.2720, lng: -66.0610 },
  { name: "House of Nazareth - Moncton", nameEs: "Casa de Nazaret - Moncton", address: "291 St George St", city: "Moncton", province: "NB", phone: "506-855-7210", url: "", category: "Shelters & Crisis", languages: ["English", "French"], hours: "24/7", lat: 46.0900, lng: -64.7700 },
  { name: "Crossroads for Women - Moncton", nameEs: "Encrucijada para Mujeres - Moncton", address: "476 St George St", city: "Moncton", province: "NB", phone: "506-853-0811", url: "", category: "Shelters & Crisis", languages: ["English", "French"], hours: "24/7", lat: 46.0920, lng: -64.7680 },

  // ===== NEWFOUNDLAND & LABRADOR =====
  // Legal Clinics
  { name: "Legal Aid NL - St. John's", nameEs: "Ayuda Legal NL - St. John's", address: "251 Empire Ave", city: "St. John's", province: "NL", phone: "709-753-7860", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5685, lng: -52.7120 },
  { name: "Public Legal Information Association of NL", nameEs: "Asociación de Información Legal Pública de NL", address: "31 Peet St", city: "St. John's", province: "NL", phone: "709-722-2643", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 47.5700, lng: -52.7110 },
  { name: "Legal Aid NL - Corner Brook", nameEs: "Ayuda Legal NL - Corner Brook", address: "21 Park St", city: "Corner Brook", province: "NL", phone: "709-634-7570", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 48.9510, lng: -57.9450 },
  { name: "Community Law Office Gander", nameEs: "Oficina Legal Comunitaria Gander", address: "10 Roe Ave", city: "Gander", province: "NL", phone: "709-256-8601", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 48.9572, lng: -54.6101 },
  // Settlement Agencies
  { name: "Association for New Canadians", nameEs: "Asociación para Nuevos Canadienses", address: "144 Military Rd", city: "St. John's", province: "NL", phone: "709-722-9680", url: "", category: "Settlement Agencies", languages: ["English", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5690, lng: -52.7100 },
  { name: "Refugee and Immigrant Advisory Council NL", nameEs: "Consejo Asesor de Refugiados e Inmigrantes NL", address: "170 Water St", city: "St. John's", province: "NL", phone: "709-726-7262", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 47.5625, lng: -52.7095 },
  { name: "Corner Brook Newcomer Services", nameEs: "Servicios para Recién Llegados de Corner Brook", address: "34 Main St", city: "Corner Brook", province: "NL", phone: "709-637-7000", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 48.9500, lng: -57.9460 },
  { name: "Central NL Immigrant Support", nameEs: "Apoyo a Inmigrantes del Centro de NL", address: "7 Cromer Ave", city: "Grand Falls-Windsor", province: "NL", phone: "709-489-6587", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 48.9330, lng: -55.6630 },
  // NGOs
  { name: "NL Human Rights Commission", nameEs: "Comisión de Derechos Humanos de NL", address: "21 Crosbie Pl", city: "St. John's", province: "NL", phone: "709-729-2709", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5720, lng: -52.7250 },
  { name: "Community Sector Council NL", nameEs: "Consejo del Sector Comunitario NL", address: "60 Pippy Pl", city: "St. John's", province: "NL", phone: "709-753-9860", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5740, lng: -52.7380 },
  { name: "Multicultural Women's Organization of NL", nameEs: "Organización Multicultural de Mujeres de NL", address: "200 Elizabeth Ave", city: "St. John's", province: "NL", phone: "709-722-7170", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 47.5715, lng: -52.7240 },
  { name: "NL Anti-Poverty Network", nameEs: "Red Anti-Pobreza de NL", address: "237 Topsail Rd", city: "St. John's", province: "NL", phone: "709-739-1019", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 47.5600, lng: -52.7380 },
  // Government Services
  { name: "NL Workplace Health Safety and Compensation Commission", nameEs: "Comisión de Salud Seguridad y Compensación en el Trabajo de NL", address: "146-148 Forest Rd", city: "St. John's", province: "NL", phone: "709-778-1000", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5660, lng: -52.7050 },
  { name: "NL Labour Relations Board", nameEs: "Junta de Relaciones Laborales de NL", address: "3rd Fl Beothuck Bldg", city: "St. John's", province: "NL", phone: "709-729-2707", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5680, lng: -52.7130 },
  { name: "Service NL - St. John's", nameEs: "Servicio NL - St. John's", address: "5 Mews Pl", city: "St. John's", province: "NL", phone: "709-729-4834", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5730, lng: -52.7360 },
  { name: "NL Office of Immigration and Multiculturalism", nameEs: "Oficina de Inmigración y Multiculturalismo de NL", address: "Confederation Bldg", city: "St. John's", province: "NL", phone: "709-729-6607", url: "", category: "Government Services", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5735, lng: -52.7350 },
  // Disability Support
  { name: "Coalition of Persons with Disabilities NL", nameEs: "Coalición de Personas con Discapacidades NL", address: "4 Escasoni Pl", city: "St. John's", province: "NL", phone: "709-722-7011", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 47.5750, lng: -52.7400 },
  { name: "Independent Living Resource Centre NL", nameEs: "Centro de Recursos de Vida Independiente NL", address: "4 Escasoni Pl", city: "St. John's", province: "NL", phone: "709-722-4031", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 47.5752, lng: -52.7402 },
  { name: "Vera Perlin Society", nameEs: "Sociedad Vera Perlin", address: "2 Escasoni Pl", city: "St. John's", province: "NL", phone: "709-739-5931", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5748, lng: -52.7398 },
  { name: "Easter Seals NL", nameEs: "Easter Seals NL", address: "206 Mt Scio Rd", city: "St. John's", province: "NL", phone: "709-754-1399", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5710, lng: -52.7480 },
  // Workers' Rights
  { name: "NL Federation of Labour", nameEs: "Federación del Trabajo de NL", address: "330 Portugal Cove Pl", city: "St. John's", province: "NL", phone: "709-754-1660", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5770, lng: -52.7200 },
  { name: "Workers' Advocacy Centre NL", nameEs: "Centro de Defensa de Trabajadores NL", address: "144 Military Rd", city: "St. John's", province: "NL", phone: "709-722-9684", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 47.5692, lng: -52.7102 },
  { name: "Community Employment Collaboration NL", nameEs: "Colaboración de Empleo Comunitario NL", address: "26 O'Leary Ave", city: "St. John's", province: "NL", phone: "709-753-1610", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 47.5740, lng: -52.7260 },
  { name: "Occupational Health Safety NL", nameEs: "Salud y Seguridad Ocupacional NL", address: "146 Forest Rd", city: "St. John's", province: "NL", phone: "709-778-1100", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 47.5662, lng: -52.7052 },
  // Shelters & Crisis
  { name: "The Gathering Place - St. John's", nameEs: "El Lugar de Encuentro - St. John's", address: "143 Military Rd", city: "St. John's", province: "NL", phone: "709-753-3234", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 47.5688, lng: -52.7098 },
  { name: "Choices for Youth", nameEs: "Opciones para la Juventud", address: "12 Carter's Hill", city: "St. John's", province: "NL", phone: "709-754-3047", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 47.5640, lng: -52.7080 },
  { name: "Naomi Centre - St. John's", nameEs: "Centro Naomi - St. John's", address: "10 Barnes Rd", city: "St. John's", province: "NL", phone: "709-579-8432", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 47.5710, lng: -52.7160 },
  { name: "Salvation Army - Corner Brook", nameEs: "Ejército de Salvación - Corner Brook", address: "3 Park St", city: "Corner Brook", province: "NL", phone: "709-634-2180", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 48.9505, lng: -57.9455 },

  // ===== PRINCE EDWARD ISLAND =====
  // Legal Clinics
  { name: "Community Legal Information Association PEI", nameEs: "Asociación de Información Legal Comunitaria PEI", address: "1 Harbourside Access Rd", city: "Charlottetown", province: "PE", phone: "902-892-0853", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 46.2340, lng: -63.1270 },
  { name: "Legal Aid PEI", nameEs: "Ayuda Legal PEI", address: "1 Harbourside Access Rd", city: "Charlottetown", province: "PE", phone: "902-368-6540", url: "", category: "Legal Clinics", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2342, lng: -63.1272 },
  { name: "PEI Francophone Legal Centre", nameEs: "Centro Legal Francófono de PEI", address: "5 Pownal St", city: "Charlottetown", province: "PE", phone: "902-566-3606", url: "", category: "Legal Clinics", languages: ["French", "English"], hours: "Mon-Fri 9AM-5PM", lat: 46.2350, lng: -63.1260 },
  { name: "UPEI Community Legal Clinic", nameEs: "Clínica Legal Comunitaria UPEI", address: "550 University Ave", city: "Charlottetown", province: "PE", phone: "902-566-0783", url: "", category: "Legal Clinics", languages: ["English"], hours: "Mon-Fri 9AM-4PM", lat: 46.2595, lng: -63.1355 },
  // Settlement Agencies
  { name: "PEI Association for Newcomers to Canada", nameEs: "Asociación de PEI para Recién Llegados a Canadá", address: "25 University Ave", city: "Charlottetown", province: "PE", phone: "902-628-6009", url: "", category: "Settlement Agencies", languages: ["English", "French", "Arabic"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2360, lng: -63.1290 },
  { name: "Newcomer Services Summerside", nameEs: "Servicios para Recién Llegados Summerside", address: "263 Heather Moyse Dr", city: "Summerside", province: "PE", phone: "902-888-8255", url: "", category: "Settlement Agencies", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 46.3939, lng: -63.7873 },
  { name: "Cooper Institute", nameEs: "Instituto Cooper", address: "81 Prince St", city: "Charlottetown", province: "PE", phone: "902-894-4573", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 46.2365, lng: -63.1300 },
  { name: "YMCA PEI Newcomer Programs", nameEs: "Programas YMCA PEI para Recién Llegados", address: "250 Queen St", city: "Charlottetown", province: "PE", phone: "902-566-3966", url: "", category: "Settlement Agencies", languages: ["English"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2355, lng: -63.1310 },
  // NGOs
  { name: "PEI Human Rights Commission", nameEs: "Comisión de Derechos Humanos de PEI", address: "53 Water St", city: "Charlottetown", province: "PE", phone: "902-368-4180", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2340, lng: -63.1250 },
  { name: "PEI Multicultural Council", nameEs: "Consejo Multicultural de PEI", address: "119 Queen St", city: "Charlottetown", province: "PE", phone: "902-628-6009", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 46.2352, lng: -63.1285 },
  { name: "PEI Advisory Council on the Status of Women", nameEs: "Consejo Asesor de PEI sobre la Condición de la Mujer", address: "100 Richmond St", city: "Charlottetown", province: "PE", phone: "902-368-4510", url: "", category: "NGOs", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2370, lng: -63.1280 },
  { name: "Atlantic Provinces Economic Council - PEI", nameEs: "Consejo Económico de las Provincias Atlánticas - PEI", address: "176 Great George St", city: "Charlottetown", province: "PE", phone: "902-894-4562", url: "", category: "NGOs", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 46.2348, lng: -63.1265 },
  // Government Services
  { name: "PEI Workers Compensation Board", nameEs: "Junta de Compensación de Trabajadores de PEI", address: "14 Weymouth St", city: "Charlottetown", province: "PE", phone: "902-368-5680", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2345, lng: -63.1275 },
  { name: "PEI Employment Standards", nameEs: "Normas de Empleo de PEI", address: "161 St Peters Rd", city: "Charlottetown", province: "PE", phone: "902-368-5550", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2380, lng: -63.1220 },
  { name: "PEI Office of Immigration", nameEs: "Oficina de Inmigración de PEI", address: "94 Euston St", city: "Charlottetown", province: "PE", phone: "902-368-5200", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2370, lng: -63.1320 },
  { name: "Access PEI - Summerside", nameEs: "Acceso PEI - Summerside", address: "120 Heather Moyse Dr", city: "Summerside", province: "PE", phone: "902-888-8000", url: "", category: "Government Services", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.3935, lng: -63.7870 },
  // Disability Support
  { name: "PEI Council of People with Disabilities", nameEs: "Consejo de PEI de Personas con Discapacidades", address: "100 Richmond St", city: "Charlottetown", province: "PE", phone: "902-892-9149", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 46.2372, lng: -63.1282 },
  { name: "Stars for Life Foundation PEI", nameEs: "Fundación Estrellas para la Vida PEI", address: "161 St Peters Rd", city: "Charlottetown", province: "PE", phone: "902-894-9002", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-4:30PM", lat: 46.2382, lng: -63.1222 },
  { name: "CNIB PEI", nameEs: "CNIB PEI", address: "40 Enman Crescent", city: "Charlottetown", province: "PE", phone: "902-566-2580", url: "", category: "Disability Support", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2330, lng: -63.1310 },
  { name: "Autism Society of PEI", nameEs: "Sociedad de Autismo de PEI", address: "13 Myrtle St", city: "Charlottetown", province: "PE", phone: "902-628-1562", url: "", category: "Disability Support", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 46.2358, lng: -63.1295 },
  // Workers' Rights
  { name: "PEI Federation of Labour", nameEs: "Federación del Trabajo de PEI", address: "2 Queen St", city: "Charlottetown", province: "PE", phone: "902-368-3068", url: "", category: "Workers' Rights", languages: ["English", "French"], hours: "Mon-Fri 9AM-5PM", lat: 46.2338, lng: -63.1255 },
  { name: "Cooper Institute Workers Program", nameEs: "Programa de Trabajadores del Instituto Cooper", address: "81 Prince St", city: "Charlottetown", province: "PE", phone: "902-894-4575", url: "", category: "Workers' Rights", languages: ["English"], hours: "Mon-Fri 9AM-5PM", lat: 46.2367, lng: -63.1302 },
  { name: "CUPE PEI", nameEs: "CUPE PEI", address: "23 Belvedere Ave", city: "Charlottetown", province: "PE", phone: "902-892-5481", url: "", category: "Workers' Rights", languages: ["English", "French"], hours: "Mon-Fri 8:30AM-4:30PM", lat: 46.2400, lng: -63.1260 },
  { name: "PEI Migrant Worker Advocacy Network", nameEs: "Red de Defensa de Trabajadores Migrantes de PEI", address: "119 Queen St", city: "Charlottetown", province: "PE", phone: "902-628-6012", url: "", category: "Workers' Rights", languages: ["English", "Spanish"], hours: "Mon-Fri 9AM-4:30PM", lat: 46.2354, lng: -63.1287 },
  // Shelters & Crisis
  { name: "Blooming House PEI", nameEs: "Casa Floreciente PEI", address: "204 Kent St", city: "Charlottetown", province: "PE", phone: "902-892-2500", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 46.2360, lng: -63.1310 },
  { name: "Anderson House Women's Shelter", nameEs: "Refugio para Mujeres Anderson House", address: "Box 964", city: "Charlottetown", province: "PE", phone: "902-892-0960", url: "", category: "Shelters & Crisis", languages: ["English", "French"], hours: "24/7", lat: 46.2362, lng: -63.1312 },
  { name: "Salvation Army PEI", nameEs: "Ejército de Salvación PEI", address: "110 Pownal St", city: "Charlottetown", province: "PE", phone: "902-628-6406", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 46.2355, lng: -63.1262 },
  { name: "Youth Outreach Charlottetown", nameEs: "Extensión Juvenil Charlottetown", address: "138 Richmond St", city: "Charlottetown", province: "PE", phone: "902-566-3255", url: "", category: "Shelters & Crisis", languages: ["English"], hours: "24/7", lat: 46.2375, lng: -63.1278 },
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
