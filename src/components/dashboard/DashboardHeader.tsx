
import { CalendarIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { YEELogo } from "@/components/YEELogo";
import { ThemeToggle } from "@/components/ThemeToggle"; // Assuming ThemeToggle is exported from here or adjust path

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2 text-neutral-600 dark:text-stone-400">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{currentDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <Button variant="outline" size="sm" className="border-neutral-200 dark:border-stone-800 text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-900 transition-colors">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
        <AddMemberDialog />
      </div>
    </div>
  );
}
