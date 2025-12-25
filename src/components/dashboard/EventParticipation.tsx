
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "High Participation", value: 45, color: "#FBD500" },
  { name: "Medium Participation", value: 35, color: "#a3a3a3" },
  { name: "Low Participation", value: 20, color: "#e5e5e5" },
];

export function EventParticipation() {
  return (
    <Card className="border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white font-black uppercase tracking-tight">Event Participation</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-stone-400 font-medium">Distribution of group participation rates</p>
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
                stroke="none"
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "High Participation" ? "#FBD500" : entry.name === "Medium Participation" ? "#737373" : "#404040"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--foreground)'
                }}
                itemStyle={{ color: 'inherit' }}
                labelStyle={{ fontWeight: '800', marginBottom: '4px', color: 'var(--foreground)' }}
                formatter={(value) => [`${value}%`, 'Participation']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-stone-400 ml-2">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
