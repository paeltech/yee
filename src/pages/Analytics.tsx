
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t("landing.adminAnalytics.title")}</h1>
          <p className="text-neutral-600 mt-2">{t("landing.adminAnalytics.subtitle")}</p>
        </div>
        <Dashboard />
      </div>
    </Layout>
  );
};

export default Analytics;
