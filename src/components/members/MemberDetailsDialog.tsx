import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Calendar, Briefcase, Edit, Trash2 } from "lucide-react";
import { EditMemberDialog } from "./EditMemberDialog";
import { DeleteMemberDialog } from "./DeleteMemberDialog";

interface MemberDetailsDialogProps {
  member: any;
  trigger: React.ReactNode;
}

export function MemberDetailsDialog({ member, trigger }: MemberDetailsDialogProps) {
  const getAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Member Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Full Name</label>
                  <p className="text-neutral-900">
                    {member.first_name} {member.middle_name} {member.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Gender</label>
                  <p className="text-neutral-900">{member.gender}</p>
                </div>
                {member.date_of_birth && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Date of Birth</label>
                    <p className="text-neutral-900">
                      {new Date(member.date_of_birth).toLocaleDateString()}
                      {getAge(member.date_of_birth) && (
                        <span className="text-sm text-neutral-600 ml-2">
                          ({getAge(member.date_of_birth)} years old)
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-neutral-600">Member Number</label>
                  <p className="text-neutral-900">{member.member_number || 'Not assigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-neutral-400" />
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Mobile Number</label>
                    <p className="text-neutral-900">{member.mobile_number}</p>
                  </div>
                </div>
                
                {member.alternative_phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-neutral-400" />
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Alternative Phone</label>
                      <p className="text-neutral-900">{member.alternative_phone}</p>
                    </div>
                  </div>
                )}

                {member.email_address && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-neutral-400" />
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Email Address</label>
                      <p className="text-neutral-900">{member.email_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {(member.residential_address || member.postal_address) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {member.residential_address && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Residential Address</label>
                      <p className="text-neutral-900">{member.residential_address}</p>
                    </div>
                  )}
                  {member.postal_address && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Postal Address</label>
                      <p className="text-neutral-900">{member.postal_address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Membership Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Membership Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-600">Member Role</label>
                  <p className="text-neutral-900">{member.member_role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Membership Status</label>
                  <Badge variant={member.membership_status === 'active' ? 'default' : 'secondary'}>
                    {member.membership_status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600">Join Date</label>
                  <p className="text-neutral-900">
                    {new Date(member.join_date).toLocaleDateString()}
                  </p>
                </div>
                {member.national_id && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">National ID</label>
                    <p className="text-neutral-900">{member.national_id}</p>
                  </div>
                )}
                {member.passport_number && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Passport Number</label>
                    <p className="text-neutral-900">{member.passport_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          {(member.occupation || member.education_level || member.monthly_income) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {member.occupation && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Occupation</label>
                      <p className="text-neutral-900">{member.occupation}</p>
                    </div>
                  )}
                  {member.education_level && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Education Level</label>
                      <p className="text-neutral-900">{member.education_level}</p>
                    </div>
                  )}
                  {member.monthly_income && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Monthly Income</label>
                      <p className="text-neutral-900">${member.monthly_income.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <EditMemberDialog member={member} />
            <DeleteMemberDialog member={member} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 