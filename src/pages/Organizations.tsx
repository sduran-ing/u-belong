import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const ResourceMap = lazy(() => import("@/components/ResourceMap"));

const Organizations = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
          {t("Find Help Near You", "Encuentra Ayuda Cerca de Ti")}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {t(
            "Community organizations, legal clinics, and support centres across Canada",
            "Organizaciones comunitarias, clínicas legales y centros de apoyo en todo Canadá"
          )}
        </p>

        <Suspense fallback={<div className="h-[600px] animate-pulse rounded-xl bg-muted" />}>
          <ResourceMap />
        </Suspense>
      </motion.div>
    </div>
  );
};

export default Organizations;
