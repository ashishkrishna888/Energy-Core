// src/components/StatsCard.jsx
import React from "react";

const StatsCard = ({ title, value, subtitle, icon, costPerHour, isPeakAlert }) => {
  const getIcon = () => {
    if (icon) return icon;
    if (title?.toLowerCase().includes("total")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    if (title?.toLowerCase().includes("on")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900/80 to-slate-800/60 border rounded-xl p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group ${
      isPeakAlert ? 'border-red-500/50 hover:border-red-500/70 shadow-red-500/10' : 'border-slate-800/50 hover:border-emerald-500/30 hover:shadow-emerald-500/10'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</div>
        <div className={`transition-colors ${
          isPeakAlert ? 'text-red-500/50 group-hover:text-red-500/70' : 'text-emerald-500/50 group-hover:text-emerald-500/70'
        }`}>
          {getIcon()}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className={`text-2xl font-bold leading-tight ${
          isPeakAlert ? 'text-red-400' : 'text-slate-50'
        }`}>{value}</div>
        {subtitle && <div className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</div>}
        {costPerHour && (
          <div className="text-xs text-slate-500 font-medium mt-0.5">
            ≈ ${costPerHour.toFixed(2)}/hr
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
