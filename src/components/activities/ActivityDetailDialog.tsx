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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{activity.activity_name}</DialogTitle>
            <Badge className={getStatusColor(activity.status)}>
              {activity.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-neutral-400" />
                  <div>
                    <div className="text-sm text-neutral-600">Date</div>
                    <div className="font-medium">{new Date(activity.activity_date).toLocaleDateString()}</div>
                  </div>
                </div>

                {activity.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-neutral-400" />
                    <div>
                      <div className="text-sm text-neutral-600">Location</div>
                      <div className="font-medium">{activity.location}</div>
                    </div>
                  </div>
                )}

                {activity.activity_type && (
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-neutral-400" />
                    <div>
                      <div className="text-sm text-neutral-600">Type</div>
                      <div className="font-medium">{activity.activity_type}</div>
                    </div>
                  </div>
                )}

                {activity.attendees_count && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-neutral-400" />
                    <div>
                      <div className="text-sm text-neutral-600">Attendees</div>
                      <div className="font-medium">{activity.attendees_count} people</div>
                    </div>
                  </div>
                )}

                {activity.budget_allocated && (
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-neutral-400" />
                    <div>
                      <div className="text-sm text-neutral-600">Budget</div>
                      <div className="font-medium">
                        TSh {activity.budget_allocated.toLocaleString()}
                        {activity.budget_spent && (
                          <span className="text-sm text-neutral-600 ml-2">
                            (Spent: TSh {activity.budget_spent.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activity.description && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-neutral-600 mb-2">Description</div>
                  <p className="text-neutral-900">{activity.description}</p>
                </div>
              )}

              {activity.outcomes && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-neutral-600 mb-2">Outcomes</div>
                  <p className="text-neutral-900">{activity.outcomes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityPhotoGallery activityId={activity.id} canManage={canManage || false} />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

