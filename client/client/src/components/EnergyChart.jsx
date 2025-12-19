// src/components/EnergyChart.jsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const EnergyChart = ({ data, title }) => {
  // data: [{ label, totalKwh }]
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-slate-200 mb-1">{label}</p>
          <p className="text-sm text-emerald-500 font-bold">
            {payload[0].value.toFixed(2)} kWh
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-bold text-slate-200">{title}</div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium">kWh</span>
        </div>
      </div>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <AreaChart 
            data={data} 
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
            <XAxis 
              dataKey="label" 
              stroke="#94a3b8" 
              style={{ fontSize: '12px' }}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              style={{ fontSize: '12px' }}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone"
              dataKey="totalKwh" 
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
