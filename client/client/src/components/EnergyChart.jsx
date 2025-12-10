// src/components/EnergyChart.jsx
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const EnergyChart = ({ data, title }) => {
  // data: [{ label, totalKwh }]
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-200">{title}</div>
        <div className="text-xs text-slate-400">kWh</div>
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalKwh" name="kWh" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
