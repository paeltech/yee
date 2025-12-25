
import { Calendar, Home, Users, BarChart3, MapPin, Settings, Building2, Layers3, FileText, Shield, LogOut, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YEELogo } from "@/components/YEELogo";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ['admin', 'chairperson', 'secretary'],
  },
  {
    title: "Councils",
    url: "/councils",
    icon: Building2,
    roles: ['admin'],
  },
  {
    title: "Wards",
    url: "/wards",
    icon: Layers3,
    roles: ['admin'],
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Users,
    roles: ['admin', 'chairperson', 'secretary'],
  },
  {
    title: "Members",
    url: "/members",
    icon: Users,
    roles: ['admin', 'chairperson', 'secretary'],
  },
  {
    title: "Activities",
    url: "/activities",
    icon: Calendar,
    roles: ['admin', 'chairperson', 'secretary'],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    title: "Locations",
    url: "/locations",
    icon: MapPin,
    roles: ['admin'],
  },
  {
    title: "Resource Center",
    url: "/documents",
    icon: FileText,
    roles: ['admin', 'chairperson', 'secretary'],
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Shield,
    roles: ['admin'],
  },
  {
    title: "Feedback",
    url: "/admin/feedback",
    icon: MessageSquare,
    roles: ['admin'],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ['admin'],
  },
];

export function AppSidebar() {
  const { user, logout, hasRole } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'chairperson':
        return 'bg-blue-100 text-blue-800';
      case 'secretary':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <Sidebar className="border-r border-neutral-200">
      <SidebarHeader className="p-6 border-b border-neutral-200">
        <YEELogo size="md" showText={true} />
        
        {user && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-900">
                {user.first_name} {user.last_name}
              </span>
              <Badge className={getRoleColor(user.role)}>
                {user.role}
              </Badge>
            </div>
            <p className="text-xs text-neutral-600 mb-3">{user.email}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-700 font-medium px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="w-full text-neutral-700 hover:bg-brand-50 hover:text-brand-700 data-[active=true]:bg-brand-100 data-[active=true]:text-brand-900 data-[active=true]:font-semibold transition-colors"
                  >
                    <a href={item.url} className="flex items-center space-x-3 px-3 py-2">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
