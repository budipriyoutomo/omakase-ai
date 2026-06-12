"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { MonthlyUsagePoint } from "@/lib/api/types";

export function UsageChart({ data }: { data?: MonthlyUsagePoint[] }) {
  const chartData = data && data.length > 0 ? data : [];

  return (
    <div className="h-56 w-full min-w-0 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ left: -8, right: 8 }}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="month"
            stroke="#999999"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <Tooltip contentStyle={{ background: "#111111", border: "1px solid #333" }} />
          <Area type="monotone" dataKey="usage" stroke="#D4AF37" fill="url(#usageGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
