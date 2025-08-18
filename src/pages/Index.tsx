
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default Index;
