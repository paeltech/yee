
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
    <Card className="border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white text-lg font-black uppercase tracking-tight">Age Distribution</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-stone-400 font-medium">Member age groups</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="age"
                axisLine={false}
                tickLine={false}
                className="text-neutral-600 dark:text-stone-500 text-[10px] font-bold"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-neutral-600 dark:text-stone-500 text-[10px] font-bold"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--foreground)'
                }}
                itemStyle={{ color: 'inherit' }}
                cursor={{ fill: 'var(--accent)', opacity: 0.1 }}
                labelStyle={{ fontWeight: '800', marginBottom: '4px', color: 'var(--foreground)' }}
              />
              <Bar dataKey="count" fill="#FBD500" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
