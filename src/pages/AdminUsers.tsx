import { Layout } from "@/components/Layout";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminUsers() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
            <p className="text-neutral-600 mt-2">
              Manage system users and assign group leadership roles
            </p>
          </div>
          <UserManagement />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
