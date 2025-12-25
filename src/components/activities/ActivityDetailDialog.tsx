import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, FileText } from "lucide-react";
import { ActivityPhotoGallery } from "./ActivityPhotoGallery";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityDetailDialogProps {
  activity: any;
  trigger: React.ReactNode;
}

export function ActivityDetailDialog({ activity, trigger }: ActivityDetailDialogProps) {
  const { user, canManageGroup } = useAuth();
  const canManage = user?.role === 'admin' || canManageGroup?.(activity.group_id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-stone-900 dark:border-stone-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight dark:text-white">{activity.activity_name}</DialogTitle>
            <Badge variant="outline" className={`${getStatusColor(activity.status)} border-none shadow-sm`}>
              {activity.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <Card className="dark:bg-stone-950/40 dark:border-stone-800 shadow-sm">
            <CardHeader className="border-b dark:border-stone-800/50 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest dark:text-stone-400 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-brand-500" />
                Activity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-brand-500" />
                  <div>
                    <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest">Date</div>
                    <div className="font-bold dark:text-white">{new Date(activity.activity_date).toLocaleDateString()}</div>
                  </div>
                </div>

                {activity.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-brand-500" />
                    <div>
                      <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest">Location</div>
                      <div className="font-bold dark:text-white">{activity.location}</div>
                    </div>
                  </div>
                )}

                {activity.activity_type && (
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-brand-500" />
                    <div>
                      <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest">Type</div>
                      <div className="font-bold dark:text-white">{activity.activity_type}</div>
                    </div>
                  </div>
                )}

                {activity.attendees_count && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-brand-500" />
                    <div>
                      <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest">Attendees</div>
                      <div className="font-bold dark:text-white">{activity.attendees_count} people</div>
                    </div>
                  </div>
                )}

                {activity.budget_allocated && (
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-brand-500" />
                    <div>
                      <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest">Budget</div>
                      <div className="font-bold dark:text-white">
                        TSh {activity.budget_allocated.toLocaleString()}
                        {activity.budget_spent && (
                          <span className="text-xs text-neutral-500 dark:text-stone-500 ml-2 font-medium">
                            (Spent: TSh {activity.budget_spent.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activity.description && (
                <div className="mt-6 pt-6 border-t dark:border-stone-800">
                  <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest mb-2">Description</div>
                  <p className="text-neutral-900 dark:text-stone-300 leading-relaxed">{activity.description}</p>
                </div>
              )}

              {activity.outcomes && (
                <div className="mt-6 pt-6 border-t dark:border-stone-800">
                  <div className="text-[10px] text-neutral-600 dark:text-stone-500 font-black uppercase tracking-widest mb-2">Outcomes</div>
                  <p className="text-neutral-900 dark:text-stone-300 leading-relaxed font-bold">{activity.outcomes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card className="dark:bg-stone-950/40 dark:border-stone-800 shadow-sm overflow-hidden">
            <CardHeader className="border-b dark:border-stone-800/50 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest dark:text-stone-400">Photos</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ActivityPhotoGallery activityId={activity.id} canManage={canManage || false} />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

