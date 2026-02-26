import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MessageCircle, MapPin, Scale } from "lucide-react";

const PageCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="mt-12 rounded-xl border bg-card p-6 shadow-md">
      <h2 className="mb-4 text-center text-xl font-bold">
        {t("Need more help?", "¿Necesitas más ayuda?")}
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="/#intake"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <MessageCircle size={16} />
          {t("Talk to the Assistant about this", "Habla con el Asistente sobre esto")}
        </a>
        <Link
          to="/organizations"
          className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          <MapPin size={16} />
          {t("Find organizations near me", "Encontrar organizaciones cerca de mí")}
        </Link>
        <Link
          to="/lawyers"
          className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          <Scale size={16} />
          {t("Find a lawyer", "Encontrar un abogado")}
        </Link>
      </div>
    </section>
  );
};

export default PageCTA;
