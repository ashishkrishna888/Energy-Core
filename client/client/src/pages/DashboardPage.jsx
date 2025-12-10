// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/apiClient";
import StatsCard from "../components/StatsCard";
import DeviceList from "../components/DeviceList";
import EnergyChart from "../components/EnergyChart";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [devices, setDevices] = useState([]);
  const [history, setHistory] = useState({ range: "daily", points: [] });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Summary error:", err?.response?.data || err.message);
    }
  }, []);

  const fetchDevices = useCallback(async () => {
    try {
      const res = await api.get("/devices");
      setDevices(res.data);
    } catch (err) {
      console.error("Devices error:", err?.response?.data || err.message);
    }
  }, []);

  const fetchHistory = useCallback(async (range = "daily") => {
    try {
      const res = await api.get(`/energy/history?range=${range}`);
      setHistory(res.data);
    } catch (err) {
      console.error("History error:", err?.response?.data || err.message);
    }
  }, []);

  // unified fetch
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchDevices(), fetchHistory("daily")]);
    setLoading(false);
  }, [fetchSummary, fetchDevices, fetchHistory]);

  useEffect(() => {
    fetchAll();

    // Poll devices+summary every 5 seconds for "real-time" feel
    const interval = setInterval(() => {
      fetchSummary();
      fetchDevices();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAll, fetchSummary, fetchDevices]);

  const handleDeviceUpdated = (updatedDevice) => {
    setDevices((prev) => prev.map((d) => (d._id === updatedDevice._id ? updatedDevice : d)));
    // Update summary total if needed by re-fetching summary; simple approach:
    fetchSummary();
  };

  return (
    <MainLayout>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-50">Real-Time Energy Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Live device status, total consumption, and history.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
          <StatsCard title="Total kW (current)" value={summary ? `${summary.totalCurrentKw} kW` : "—"} subtitle={`${summary ? summary.deviceCount : 0} devices`} />
          <StatsCard title="Devices ON" value={summary ? summary.devicesOn : "—"} subtitle="Active" />
          <StatsCard title="Devices OFF" value={summary ? summary.devicesOff : "—"} subtitle="Idle" />
        </div>

        <div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 h-full">
            <div className="text-sm font-medium text-slate-200 mb-2">Quick Category Summary</div>
            <div className="text-xs text-slate-400">
              {summary && summary.byCategory
                ? Object.entries(summary.byCategory).map(([cat, info]) => (
                    <div key={cat} className="flex items-center justify-between mt-2">
                      <div className="text-xs text-slate-200">{cat}</div>
                      <div className="text-xs text-slate-400">{info.count} · {info.currentKw?.toFixed(2) ?? 0} kW</div>
                    </div>
                  ))
                : "No data"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        <div className="lg:col-span-2">
          <EnergyChart data={history.points} title={`Energy History (${history.range})`} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-200">Devices</div>
            <div className="text-xs text-slate-400">Live</div>
          </div>
          <DeviceList devices={devices} onDeviceUpdated={handleDeviceUpdated} />
        </div>
      </div>

      <div className="text-xs text-slate-500 mt-2">Last updated: {new Date().toLocaleString()}</div>
    </MainLayout>
  );
};

export default DashboardPage;
