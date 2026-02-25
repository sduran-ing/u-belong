import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-card">
      {/* Crisis banner */}
      <div className="bg-destructive py-2 text-center text-sm font-semibold text-destructive-foreground">
        {t(
          "Crisis? Call 911 or 988 (Suicide Crisis Helpline)",
          "¿Crisis? Llama al 911 o 988 (Línea de Crisis Suicida)"
        )}
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold">U Belong</h3>
            <p className="text-sm text-muted-foreground">
              {t(
                "Free, confidential civic rights guidance for newcomers in Canada.",
                "Orientación gratuita y confidencial sobre derechos cívicos para recién llegados a Canadá."
              )}
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">{t("Quick Links", "Enlaces Rápidos")}</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">{t("Home", "Inicio")}</Link>
              <Link to="/anti-discrimination" className="text-muted-foreground transition-colors hover:text-primary">{t("Anti-Discrimination", "Anti-Discriminación")}</Link>
              <Link to="/disability-rights" className="text-muted-foreground transition-colors hover:text-primary">{t("Disability Rights", "Derechos de Discapacidad")}</Link>
              <Link to="/workplace-rights" className="text-muted-foreground transition-colors hover:text-primary">{t("Workplace Rights", "Derechos Laborales")}</Link>
              <Link to="/organizations" className="text-muted-foreground transition-colors hover:text-primary">{t("Organizations", "Organizaciones")}</Link>
              <Link to="/lawyers" className="text-muted-foreground transition-colors hover:text-primary">{t("Lawyers", "Abogados")}</Link>
              <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">{t("About Us", "Sobre Nosotros")}</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">{t("Emergency", "Emergencia")}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>🚨 {t("Emergency: 911", "Emergencia: 911")}</p>
              <p>💬 {t("Crisis Line: 988", "Línea de Crisis: 988")}</p>
              <p>📞 {t("Crime Stoppers: 1-800-222-8477", "Crime Stoppers: 1-800-222-8477")}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2025 Tiyapuy. {t("Built with ❤️ for our community.", "Hecho con ❤️ para nuestra comunidad.")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
