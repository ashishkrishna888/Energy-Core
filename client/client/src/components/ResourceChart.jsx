// src/components/ResourceChart.jsx
import React, { useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Zap, Droplets } from "lucide-react";

const ResourceChart = ({ energyData = [], waterData = [], energyLimit = 20, waterLimit = 100 }) => {
  const [activeTab, setActiveTab] = useState("energy"); // "energy" or "water"

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const barData = payload.find(p => p.dataKey === 'value');
      const isEnergy = activeTab === "energy";
      const limit = isEnergy ? energyLimit : waterLimit;
      const unit = isEnergy ? "kWh" : "L";
      const isOverLimit = barData && barData.value > limit;
      
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs font-semibold text-slate-200 mb-1">{label}</p>
          {barData && (
            <>
              <p className={`text-sm font-bold ${isOverLimit ? 'text-red-400' : isEnergy ? 'text-emerald-500' : 'text-sky-400'}`}>
                {barData.value.toFixed(2)} {unit}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Limit: {limit} {unit}
                {isOverLimit && <span className="text-red-400 ml-2">⚠ Over limit</span>}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Prepare chart data
  const prepareChartData = () => {
    const data = activeTab === "energy" ? energyData : waterData;
    return (data || []).map(item => {
      const label = item.label || item.date || item.time || '';
      const value = item.totalKwh || item.totalLiters || item.value || item.kwh || item.liters || 0;
      const limit = activeTab === "energy" ? energyLimit : waterLimit;
      return {
        label,
        value: typeof value === 'number' ? value : parseFloat(value) || 0,
        isOverLimit: (typeof value === 'number' ? value : parseFloat(value) || 0) > limit
      };
    });
  };

  const chartData = prepareChartData();
  const currentLimit = activeTab === "energy" ? energyLimit : waterLimit;
  const color = activeTab === "energy" ? "emerald" : "sky";

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm h-full">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-bold text-slate-200">Resource Conservation Monitor</div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <div className={`h-1.5 w-1.5 rounded-full ${activeTab === "energy" ? "bg-emerald-500" : "bg-sky-400"}`} />
          <span className="font-medium">{activeTab === "energy" ? "kWh" : "Liters"}</span>
          <span className="text-slate-500">·</span>
          <span className="text-red-400">Goal: {currentLimit} {activeTab === "energy" ? "kWh" : "L"}</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("energy")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "energy"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/50"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Energy
        </button>
        <button
          onClick={() => setActiveTab("water")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "water"
              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              : "bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/50"
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          Water
        </button>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <ComposedChart 
            data={chartData} 
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
            <XAxis 
              dataKey="label" 
              stroke="#94a3b8" 
              style={{ fontSize: '10px' }}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              style={{ fontSize: '10px' }}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={currentLimit} 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: "Conservation Goal", position: "right", fill: "#ef4444", fontSize: 10 }}
            />
            <Bar 
              dataKey="value"
              name={activeTab === "energy" ? "Energy Usage" : "Water Usage"}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => {
                // Simple Red/Green Logic: Red if over limit, Green/Blue if under
                const fillColor = entry.isOverLimit 
                  ? "url(#redGradient)" 
                  : (activeTab === "energy" ? "url(#greenGradient)" : "url(#blueGradient)");
                return (
                  <Cell 
                    key={`cell-${index}`}
                    fill={fillColor}
                  />
                );
              })}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceChart;

