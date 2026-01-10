import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Review } from "@shared/schema";

interface FloorInsightsChartProps {
  reviews: Review[];
}

export function FloorInsightsChart({ reviews }: FloorInsightsChartProps) {
  const floorData = reviews.reduce((acc, review) => {
    const floor = review.floorNumber;
    if (!acc[floor]) {
      acc[floor] = { floor, totalRating: 0, count: 0 };
    }
    acc[floor].totalRating += review.overallRating;
    acc[floor].count += 1;
    return acc;
  }, {} as Record<number, { floor: number; totalRating: number; count: number }>);

  const chartData = Object.values(floorData)
    .map((item) => ({
      floor: `Floor ${item.floor}`,
      floorNum: item.floor,
      rating: Number((item.totalRating / item.count).toFixed(1)),
      reviews: item.count,
    }))
    .sort((a, b) => a.floorNum - b.floorNum);

  const getBarColor = (rating: number) => {
    if (rating >= 4) return "hsl(var(--chart-3))";
    if (rating >= 3) return "hsl(var(--chart-4))";
    if (rating >= 2) return "hsl(var(--chart-5))";
    return "hsl(var(--destructive))";
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Floor Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No floor data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Floor Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 40)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 5]} tickCount={6} hide />
            <YAxis
              dataKey="floor"
              type="category"
              width={70}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                      <p className="font-medium">{data.floor}</p>
                      <p className="text-sm text-muted-foreground">
                        Rating: {data.rating}/5
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.reviews} review{data.reviews !== 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rating" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rating)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
