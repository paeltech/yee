
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Database, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GroupDocumentUpload } from "./GroupDocumentUpload";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentList } from "./DocumentList";

export function SettingsPage() {
  const { toast } = useToast();

  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Database Backup",
      description: "Database backup has been initiated.",
    });
  };

  const handleViewLogs = () => {
    toast({
      title: "Database Logs",
      description: "Opening database logs...",
    });
  };

  const handleUpdateUserSettings = () => {
    toast({
      title: "User Settings Updated",
      description: "User management settings have been saved.",
    });
  };

  const handleResetSecurity = () => {
    toast({
      title: "Security Reset",
      description: "Security settings have been reset to defaults.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-2">Manage application settings and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-neutral-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-neutral-900">General Settings</CardTitle>
                <p className="text-sm text-neutral-600">Basic application configuration</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue="Youth Groups Management System" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Africa/Dar_es_Salaam" />
            </div>
            <Button className="bg-brand-500 text-black hover:bg-brand-600" onClick={handleSaveGeneral}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-neutral-900">Database Settings</CardTitle>
                <p className="text-sm text-neutral-600">Database configuration and maintenance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Database Status</span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={handleBackupDatabase}>
              Backup Database
            </Button>
            <Button variant="outline" className="w-full" onClick={handleViewLogs}>
              View Database Logs
            </Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-neutral-900">User Management</CardTitle>
                <p className="text-sm text-neutral-600">Manage user roles and permissions</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Member Role</Label>
              <Input defaultValue="Member" />
            </div>
            <div className="space-y-2">
              <Label>Auto-approve Registrations</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-approve" className="rounded" />
                <label htmlFor="auto-approve" className="text-sm text-neutral-600">
                  Automatically approve new member registrations
                </label>
              </div>
            </div>
            <Button className="bg-brand-500 text-black hover:bg-brand-600" onClick={handleUpdateUserSettings}>Update Settings</Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-neutral-900">Security Settings</CardTitle>
                <p className="text-sm text-neutral-600">Security and access control</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Data Retention Period (months)</Label>
              <Input type="number" defaultValue="24" />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <Button variant="destructive" className="w-full" onClick={handleResetSecurity}>
              Reset Security Settings
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Separator className="my-8" />
          <h2 className="text-2xl font-bold mb-4">General Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DocumentUpload onUpload={() => {}} />
            </div>
            <div>
              <DocumentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
