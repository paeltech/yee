
import { CalendarIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { YEELogo } from "@/components/YEELogo";

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">YOUTH ECONOMIC EMPOWERMENT PORTAL</h1>
          <div className="flex items-center space-x-2 mt-2 text-neutral-600">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm">{currentDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
        <AddMemberDialog />
      </div>
    </div>
  );
}
