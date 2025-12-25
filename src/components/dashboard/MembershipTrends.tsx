
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
    <Card className="border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white font-black uppercase tracking-tight">Membership Growth Trends</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-stone-400 font-medium">Monthly membership statistics over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-stone-800" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-neutral-600 dark:text-stone-500 text-xs font-bold"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-neutral-600 dark:text-stone-500 text-xs font-bold"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--foreground)'
                }}
                itemStyle={{ color: 'inherit' }}
                labelStyle={{ fontWeight: '800', marginBottom: '4px', color: 'var(--foreground)' }}
              />
              <Line
                type="monotone"
                dataKey="members"
                stroke="#FBD500"
                strokeWidth={4}
                dot={{ fill: '#FBD500', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: '#FBD500', strokeWidth: 4 }}
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
