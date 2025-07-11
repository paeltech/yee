import { Layout } from "@/components/Layout";
import { DocumentList } from "@/components/settings/DocumentList";

export default function Documents() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Resources center</h1>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <DocumentList />
          </div>
        </div>
      </div>
    </Layout>
  );
} 