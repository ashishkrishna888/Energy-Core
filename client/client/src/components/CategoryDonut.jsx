// src/components/CategoryDonut.jsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const CategoryDonut = ({ data }) => {
  // data: { category: { count, currentKw } }
  const COLORS = {
    'HVAC': '#10b981',
    'LIGHTING': '#fbbf24',
    'WATER_HEATER': '#3b82f6',
    'OTHER': '#8b5cf6'
  };

  const prepareChartData = () => {
    if (!data) return [];
    
    const categoryLabels = {
      'HVAC': 'HVAC',
      'LIGHTING': 'Lighting',
      'WATER_HEATER': 'Water Heater',
      'OTHER': 'Other'
    };
    
    const entries = Object.entries(data)
      .filter(([cat]) => {
        // Only filter out OTHER if there are other categories
        if (cat === 'OTHER') {
          return Object.keys(data).length > 1;
        }
        return true;
      })
      .map(([category, info]) => ({
        name: categoryLabels[category] || category,
        categoryKey: category,
        value: info.currentKw || 0,
        count: info.count || 0
      }))
      .filter(item => item.value > 0 || item.count > 0);
    
    return entries;
  };

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-slate-200 mb-1">{data.name}</p>
          <p className="text-sm text-emerald-500 font-bold">
            {data.value.toFixed(2)} kW
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {data.payload.count} device{data.payload.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#e2e8f0" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {name}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-sm text-slate-500">No category data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={55}
            innerRadius={30}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.categoryKey] || COLORS['OTHER']} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryDonut;

