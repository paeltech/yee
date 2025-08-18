
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-neutral-50">
        {user && <AppSidebar />}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
