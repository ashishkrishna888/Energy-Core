// src/components/DeviceList.jsx
import React from "react";
import DeviceCard from "./DeviceCard";

const DeviceList = ({ devices, onDeviceUpdated }) => {
  if (!devices || devices.length === 0) {
    return (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 text-sm text-slate-400">
        No devices found. Add one from the API or seed the DB.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {devices.map((d) => (
        <DeviceCard key={d._id} device={d} onToggled={onDeviceUpdated} />
      ))}
    </div>
  );
};

export default DeviceList;
