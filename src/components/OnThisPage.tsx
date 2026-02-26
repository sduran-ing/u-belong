import { useLanguage } from "@/contexts/LanguageContext";

interface AnchorItem {
  id: string;
  en: string;
  es: string;
}

const OnThisPage = ({ items }: { items: AnchorItem[] }) => {
  const { t } = useLanguage();

  return (
    <nav className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("On this page", "En esta página")}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-block rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {t(item.en, item.es)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default OnThisPage;
