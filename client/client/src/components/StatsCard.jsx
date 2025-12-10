// src/components/StatsCard.jsx
import React from "react";

const StatsCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-bold text-slate-50">{value}</div>
        {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatsCard;
