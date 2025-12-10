// src/components/DeviceCard.jsx
import React, { useState } from "react";
import api from "../api/apiClient";

const DeviceCard = ({ device, onToggled }) => {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/devices/${device._id}/toggle`);
      onToggled(res.data);
    } catch (err) {
      console.error("Toggle error:", err?.response?.data || err.message);
      // optional: show toast / error UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-50">{device.name}</div>
          <div className="text-xs text-slate-400 mt-1">{device.category} · {device.location}</div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-medium ${device.status === "ON" ? "text-emerald-400" : "text-slate-400"}`}>
            {device.status}
          </div>
          <div className="text-xs text-slate-400 mt-1">{device.currentPowerKw?.toFixed(2) ?? "0.00"} kW</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-400">Last: {device.lastToggledAt ? new Date(device.lastToggledAt).toLocaleString() : "—"}</div>

        <button
          onClick={toggle}
          disabled={loading}
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            device.status === "ON" ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-transparent text-slate-100 border-slate-700"
          } transition disabled:opacity-60`}
        >
          {loading ? "..." : device.status === "ON" ? "Turn OFF" : "Turn ON"}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
