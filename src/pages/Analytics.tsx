
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";

const Analytics = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-600 mt-2">Detailed analytics and insights</p>
        </div>
        <Dashboard />
      </div>
    </Layout>
  );
};

export default Analytics;
