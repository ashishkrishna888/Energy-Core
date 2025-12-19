// src/components/DeviceList.jsx
// Receives props from parent - No data fetching
import React from "react";
import DeviceCard from "./DeviceCard";

const DeviceList = ({ devices, onDeviceUpdated, onToggle, onEcoModeToggle, onDelete }) => {
  if (!devices || devices.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-800/50 rounded-2xl p-8 text-center backdrop-blur-sm">
        <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-sm text-slate-400 font-medium">No devices found</p>
        <p className="text-xs text-slate-500 mt-1">No devices connected</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1 device-list-scrollbar">
      {devices.map((d) => (
        <DeviceCard 
          key={d._id} 
          device={d} 
          onToggle={onDeviceUpdated || onToggle}
          onEcoModeToggle={onEcoModeToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DeviceList;
