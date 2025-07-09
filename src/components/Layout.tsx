
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-neutral-50">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
