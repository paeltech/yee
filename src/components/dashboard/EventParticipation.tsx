
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "High Participation", value: 45, color: "#f59e0b" },
  { name: "Medium Participation", value: 35, color: "#a3a3a3" },
  { name: "Low Participation", value: 20, color: "#e5e5e5" },
];

export function EventParticipation() {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-neutral-900">Event Participation</CardTitle>
        <p className="text-sm text-neutral-600">Distribution of group participation rates</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Participation']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
