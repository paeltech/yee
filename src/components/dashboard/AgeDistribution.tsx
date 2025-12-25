
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { age: "15-18", count: 487 },
  { age: "19-22", count: 742 },
  { age: "23-26", count: 865 },
  { age: "27-30", count: 523 },
  { age: "31-35", count: 230 },
];

export function AgeDistribution() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900 text-lg">Age Distribution</CardTitle>
        <p className="text-sm text-neutral-600">Member age groups</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="age" 
                axisLine={false}
                tickLine={false}
                className="text-neutral-600 text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-neutral-600 text-xs"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#FBD500" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
