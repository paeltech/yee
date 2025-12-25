
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Councils from "./pages/Councils";
import Wards from "./pages/Wards";
import Groups from "./pages/Groups";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import GroupDetail from "./pages/GroupDetail";
import Activities from "./pages/Activities";
import Analytics from "./pages/Analytics";
import Locations from "./pages/Locations";
import Settings from "./pages/Settings";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import AdminUsers from "./pages/AdminUsers";
import AdminFeedback from "./pages/AdminFeedback";
import Landing from "./pages/Landing";
import PublicGroups from "./pages/PublicGroups";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Landing />} />
            <Route path="/councils" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Councils />
              </ProtectedRoute>
            } />
            <Route path="/wards" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Wards />
              </ProtectedRoute>
            } />
            <Route path="/groups/public" element={<PublicGroups />} />
            <Route path="/groups" element={
              <ProtectedRoute requiredRoles={['admin', 'chairperson', 'secretary']}>
                <Groups />
              </ProtectedRoute>
            } />
            <Route path="/groups/:id" element={
              <ProtectedRoute requiredRoles={['admin', 'chairperson', 'secretary']}>
                <GroupDetail />
              </ProtectedRoute>
            } />
            <Route path="/members" element={
              <ProtectedRoute requiredRoles={['admin', 'chairperson', 'secretary']}>
                <Members />
              </ProtectedRoute>
            } />
            <Route path="/members/:id" element={
              <ProtectedRoute requiredRoles={['admin', 'chairperson', 'secretary']}>
                <MemberDetail />
              </ProtectedRoute>
            } />
            <Route path="/activities" element={
              <ProtectedRoute requiredRoles={['admin', 'chairperson', 'secretary']}>
                <Activities />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/locations" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Locations />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute requiredRoles={['admin', 'chairperson', 'secretary']}>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminFeedback />
              </ProtectedRoute>
            } />
            <Route path="/admin/blogs" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminBlogs />
              </ProtectedRoute>
            } />
            <Route path="/admin/blogs/new" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminBlogEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/blogs/edit/:id" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminBlogEditor />
              </ProtectedRoute>
            } />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
