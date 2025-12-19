// src/components/ConservationChart.jsx
import React, { useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Zap, Droplets } from "lucide-react";

const ConservationChart = ({ energyData = [], waterData = [], energyLimit = 15, waterLimit = 100 }) => {
  // Internal tab state
  const [activeTab, setActiveTab] = useState("energy"); // "energy" or "water"
  
  // Determine current dataset and limit based on active tab
  const currentData = activeTab === "energy" ? energyData : waterData;
  const currentLimit = activeTab === "energy" ? energyLimit : waterLimit;
  const unit = activeTab === "energy" ? "kWh" : "L";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const barData = payload.find(p => p.dataKey === 'value');
      const isOverLimit = barData && barData.value > currentLimit;
      
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs font-semibold text-slate-200 mb-1">{label}</p>
          {barData && (
            <>
              <p className={`text-sm font-bold ${isOverLimit ? 'text-red-400' : activeTab === 'energy' ? 'text-emerald-500' : 'text-sky-400'}`}>
                {barData.value.toFixed(2)} {unit}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Limit: {currentLimit} {unit}
                {isOverLimit && <span className="text-red-400 ml-2">⚠ Over limit</span>}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Prepare chart data with color logic
  const chartData = (currentData || []).map(item => {
    const label = item.label || item.date || '';
    const value = item.value || item.totalKwh || item.totalLiters || 0;
    return {
      label,
      value: typeof value === 'number' ? value : parseFloat(value) || 0,
      isOverLimit: (typeof value === 'number' ? value : parseFloat(value) || 0) > currentLimit
    };
  });

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm h-full">
      {/* Header with Tab Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-bold text-slate-200">
          Resource Conservation Monitor
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <div className={`h-1.5 w-1.5 rounded-full ${activeTab === "energy" ? "bg-emerald-500" : "bg-sky-400"}`} />
          <span className="font-medium">{unit}</span>
          <span className="text-slate-500">·</span>
          <span className="text-red-400">Goal: {currentLimit} {unit}</span>
        </div>
      </div>

      {/* Tab Toggle Pills */}
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

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <ComposedChart 
            data={chartData} 
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="greenGradient-energy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="blueGradient-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="redGradient-energy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="redGradient-water" x1="0" y1="0" x2="0" y2="1">
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
              tickCount={6}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={currentLimit} 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: "Limit", 
                position: "insideTopRight", 
                fill: "#ef4444", 
                fontSize: 11,
                dy: -10
              }}
            />
            <Bar 
              dataKey="value"
              name={activeTab === "energy" ? "Energy Usage" : "Water Usage"}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => {
                // Simple Red/Green Logic: Red if over limit, Green/Blue if under
                const fillColor = entry.isOverLimit 
                  ? `url(#redGradient-${activeTab})` 
                  : (activeTab === "energy" ? `url(#greenGradient-${activeTab})` : `url(#blueGradient-${activeTab})`);
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

export default ConservationChart;
