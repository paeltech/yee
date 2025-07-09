
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", members: 2400, newMembers: 145 },
  { month: "Feb", members: 2480, newMembers: 167 },
  { month: "Mar", members: 2520, newMembers: 134 },
  { month: "Apr", members: 2610, newMembers: 189 },
  { month: "May", members: 2720, newMembers: 201 },
  { month: "Jun", members: 2847, newMembers: 178 },
];

export function MembershipTrends() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900">Membership Growth Trends</CardTitle>
        <p className="text-sm text-neutral-600">Monthly membership statistics over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-neutral-600"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-neutral-600"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                name="Total Members"
              />
              <Line 
                type="monotone" 
                dataKey="newMembers" 
                stroke="#737373" 
                strokeWidth={2}
                dot={{ fill: '#737373', strokeWidth: 2, r: 3 }}
                name="New Members"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
