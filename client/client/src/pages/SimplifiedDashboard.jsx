// src/pages/SimplifiedDashboard.jsx
// Full Stack Dashboard - Connected to Backend API
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ConservationChart from "../components/ConservationChart";
import DeviceList from "../components/DeviceList";
import api from "../api/apiClient";
import { ResponsiveContainer, ComposedChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Zap, Droplets, DollarSign, Leaf, AlertTriangle, Calculator, Settings, Smartphone, Plus, Trash2 } from "lucide-react";

const SimplifiedDashboard = () => {
  // ========== CENTRAL STATE ==========
  
  // Navigation state
  const [currentView, setCurrentView] = useState("overview"); // 'overview', 'energy', 'water', 'settings'
  
  // Limits state
  const [limits, setLimits] = useState({ energy: 15, water: 100 });
  
  // Devices state - Fetched from backend
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // History data - Fetched from backend APIs
  const [historyData, setHistoryData] = useState({ energy: [], water: [] });
  
  // Water system state
  const [leakDetected, setLeakDetected] = useState(false);
  const [electricityRate, setElectricityRate] = useState(12); // INR per kWh (Tier-2 city rate)
  
  // Smart Devices form state
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("energy");
  const [isAdding, setIsAdding] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  // ========== API CALLS ==========
  
  // Fetch devices and history from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch devices
        const devicesResponse = await api.get("/devices");
        setDevices(devicesResponse.data);
        
        // If no devices, seed them
        if (devicesResponse.data.length === 0) {
          try {
            await api.post("/devices/seed");
            const reseedResponse = await api.get("/devices");
            setDevices(reseedResponse.data);
          } catch (seedError) {
            console.error("Seed error:", seedError);
          }
        }

        // Fetch energy history
        try {
          const energyResponse = await api.get("/energy/history?range=daily");
          const energyPoints = energyResponse.data.points || [];
          // Transform to match chart format: { label, value }
          const energyData = energyPoints.map(point => ({
            label: new Date(point.label).toLocaleDateString('en-US', { weekday: 'short' }) || point.label,
            value: point.totalKwh || 0
          }));
          setHistoryData(prev => ({ ...prev, energy: energyData }));
        } catch (energyError) {
          console.error("Energy history error:", energyError.message);
          setHistoryData(prev => ({ ...prev, energy: [] }));
        }

        // Fetch water history
        try {
          const waterResponse = await api.get("/devices/history/water?range=daily");
          const waterPoints = waterResponse.data.points || [];
          // Transform to match chart format: { label, value }
          const waterData = waterPoints.map(point => ({
            label: new Date(point.label).toLocaleDateString('en-US', { weekday: 'short' }) || point.label,
            value: point.totalLiters || 0
          }));
          setHistoryData(prev => ({ ...prev, water: waterData }));
        } catch (waterError) {
          console.error("Water history error:", waterError.message);
          setHistoryData(prev => ({ ...prev, water: [] }));
        }

        // Fetch user settings
        try {
          const settingsResponse = await api.get("/settings");
          setLimits({
            energy: settingsResponse.data.energyLimit || 15,
            water: settingsResponse.data.waterLimit || 100
          });
        } catch (settingsError) {
          console.error("Settings fetch error:", settingsError.message);
          // Keep default values if fetch fails
        }
      } catch (error) {
        console.error("Connection Error:", error.message);
        // Fallback to empty arrays if server is offline
        setDevices([]);
        setHistoryData({ energy: [], water: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // ========== LOGIC FUNCTIONS ==========
  
  // Toggle device ON/OFF - Real API call
  const toggleDevice = async (id) => {
    try {
      const response = await api.patch(`/devices/${id}/toggle`);
      // Update device in state with server response
      setDevices((prev) => 
        prev.map((device) => 
          device._id === id ? response.data : device
        )
      );
      
      // Refetch history data after device toggle to reflect real-time changes
      try {
        if (response.data.type === 'energy') {
          const energyResponse = await api.get("/energy/history?range=daily");
          const energyPoints = energyResponse.data.points || [];
          const energyData = energyPoints.map(point => {
            const date = new Date(point.label);
            const label = isNaN(date.getTime()) 
              ? point.label 
              : date.toLocaleDateString('en-US', { weekday: 'short' });
            return {
              label: label,
              value: point.totalKwh || 0
            };
          });
          setHistoryData(prev => ({ ...prev, energy: energyData }));
        } else if (response.data.type === 'water') {
          const waterResponse = await api.get("/devices/history/water?range=daily");
          const waterPoints = waterResponse.data.points || [];
          const waterData = waterPoints.map(point => {
            const date = new Date(point.label);
            const label = isNaN(date.getTime()) 
              ? point.label 
              : date.toLocaleDateString('en-US', { weekday: 'short' });
            return {
              label: label,
              value: point.totalLiters || 0
            };
          });
          setHistoryData(prev => ({ ...prev, water: waterData }));
        }
      } catch (historyError) {
        console.error("Error refreshing history:", historyError.message);
      }
    } catch (error) {
      console.error("Toggle device error:", error.message);
    }
  };
  
  // Toggle Eco Mode - Real API call
  const toggleEcoMode = async (id) => {
    try {
      const response = await api.patch(`/devices/${id}/eco`);
      // Update device in state with server response
      setDevices((prev) => 
        prev.map((device) => 
          device._id === id ? response.data : device
        )
      );
    } catch (error) {
      console.error("Toggle eco mode error:", error.message);
    }
  };

  // Create Device - Real API call
  const createDevice = async (deviceData) => {
    try {
      const response = await api.post("/devices", deviceData);
      // Add new device to state
      setDevices((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Create device error:", error.message);
      throw error;
    }
  };

  // Delete Device - Real API call
  const deleteDevice = async (id) => {
    try {
      await api.delete(`/devices/${id}`);
      // Remove device from state
      setDevices((prev) => prev.filter((device) => device._id !== id));
    } catch (error) {
      console.error("Delete device error:", error.message);
      throw error;
    }
  };
  
  // Simulate water leak
  const simulateLeak = () => {
    setLeakDetected(true);
    
    // Update water data: Set today's value to 250L (massive spike)
    setHistoryData((prev) => {
      const updated = [...prev.water];
      if (updated.length > 0) {
        const todayIndex = updated.length - 1;
        updated[todayIndex] = {
          ...updated[todayIndex],
          value: 250, // Critical spike
        };
      }
      return { ...prev, water: updated };
    });
    
    // Show browser alert
    alert("⚠️ Critical Water Leak Detected!");
  };

  // Reset leak simulation
  const resetSimulation = async () => {
    setLeakDetected(false);
    
    // Refetch water history to restore real data
    try {
      const waterResponse = await api.get("/devices/history/water?range=daily");
      const waterPoints = waterResponse.data.points || [];
      const waterData = waterPoints.map(point => {
        const date = new Date(point.label);
        const label = isNaN(date.getTime()) 
          ? point.label 
          : date.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          label: label,
          value: point.totalLiters || 0
        };
      });
      setHistoryData(prev => ({ ...prev, water: waterData }));
    } catch (error) {
      console.error("Error resetting water data:", error.message);
    }
  };
  
  // Update limits (Energy or Water) - Local state update for instant UI feedback
  const updateLimits = (type, value) => {
    setLimits((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Save settings to backend (called on slider release)
  const saveSettings = async (type, value) => {
    try {
      const updateData = {};
      if (type === 'energy') {
        updateData.energyLimit = value;
      } else if (type === 'water') {
        updateData.waterLimit = value;
      }
      
      await api.patch("/settings", updateData);
      // Settings saved successfully (no need to update state, already updated locally)
    } catch (error) {
      console.error("Error saving settings:", error.message);
      // Optionally show error message to user
    }
  };
  
  // ========== COMPUTED VALUES ==========
  
  // Calculate total energy usage (sum of active devices)
  // Use isOn field from backend, fallback to status for backward compatibility
  // Calculate total current power load (kW) - this is instantaneous power, not energy
  const totalCurrentLoad = devices
    .filter((d) => d.isOn || d.status === "ON")
    .reduce((sum, d) => sum + (d.currentPowerKw || d.consumption || 0), 0);
  
  const totalWaterUsage = 50; // Mock value
  
  // Calculate monthly bill: kW × 24 hours × 30 days × rate (₹/kWh)
  const monthlyBill = totalCurrentLoad * 24 * 30 * electricityRate;
  
  // ========== RENDER VIEWS ==========
  
  // Energy Grid View
  if (currentView === "energy") {
    return (
      <DashboardLayout activeTab={currentView} onTabChange={setCurrentView}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Energy Grid</h1>
              <p className="text-xs text-slate-400">Bill calculator & energy analysis</p>
            </div>
          </div>

          {/* Bill Predictor */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Bill Predictor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Electricity Rate (₹ per kWh)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Estimated Monthly Bill</div>
                <div className="text-3xl font-bold text-emerald-500">
                  ₹{monthlyBill.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Based on {totalCurrentLoad.toFixed(2)} kW × 24 hrs × 30 days × ₹{electricityRate}/kWh
                </div>
              </div>
            </div>
          </div>

          {/* Energy History Chart (Locked to Energy) */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-200">Energy Consumption Analysis</h3>
              <p className="text-sm text-slate-400">Daily energy usage (kWh) over the last 7 days</p>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={historyData.energy}>
                  <defs>
                    <linearGradient id="energyGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="energyRedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickCount={6}
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [`${value.toFixed(2)} kWh`, 'Energy Usage']}
                  />
                  <ReferenceLine 
                    y={limits.energy} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3" 
                    strokeWidth={2}
                    label={{ 
                      value: 'Limit', 
                      position: 'insideTopRight', 
                      fill: '#ef4444', 
                      fontSize: 12,
                      dy: -10
                    }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                    {historyData.energy.map((entry, index) => {
                      const isOverLimit = entry.value > limits.energy;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isOverLimit ? 'url(#energyRedGradient)' : 'url(#energyGreenGradient)'} 
                        />
                      );
                    })}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Water System View (Dedicated Water-Only View)
  if (currentView === "water") {
    return (
      <DashboardLayout activeTab={currentView} onTabChange={setCurrentView}>
        <div className="space-y-6">
          {/* 1. LEAK DETECTOR CONTROL */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className={`p-6 rounded-full border-4 mb-4 transition-all duration-500 ${
              leakDetected 
                ? 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                : 'bg-slate-700/30 border-slate-600'
            }`}>
              <Droplets 
                size={48} 
                className={leakDetected ? "text-red-500 animate-bounce" : "text-sky-500"} 
              />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Main Water Valve Status</h2>
            <p className={`text-lg font-mono mb-6 ${leakDetected ? "text-red-500 font-bold" : "text-emerald-500"}`}>
              {leakDetected ? "⚠️ CRITICAL FLOW DETECTED" : "● NORMAL FLOW"}
            </p>

            {!leakDetected ? (
              <button 
                onClick={simulateLeak}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105"
              >
                ⚠️ SIMULATE LEAK
              </button>
            ) : (
              <button 
                onClick={resetSimulation}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg"
              >
                RESET SYSTEM & CLOSE VALVE
              </button>
            )}
          </div>

          {/* 2. WATER FLOW HISTORY CHART (Locked to Water) */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Water Flow Analysis</h3>
              <p className="text-sm text-slate-400">Real-time liters per minute (LPM) monitoring</p>
            </div>
            
                  <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={historyData.water}>
                  <defs>
                    <linearGradient id="waterBlueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="waterRedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickCount={6}
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [`${value.toFixed(2)} L`, 'Water Usage']}
                  />
                  <ReferenceLine 
                    y={limits.water} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3" 
                    strokeWidth={2}
                    label={{ 
                      value: 'Safety Limit', 
                      position: 'insideTopRight', 
                      fill: '#ef4444', 
                      fontSize: 12,
                      dy: -10
                    }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                    {historyData.water.map((entry, index) => {
                      const isOverLimit = entry.value > limits.water;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isOverLimit ? 'url(#waterRedGradient)' : 'url(#waterBlueGradient)'} 
                        />
                      );
                    })}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Smart Devices View
  if (currentView === "devices") {
    const handleCreateDevice = async (e) => {
      e.preventDefault();
      if (!newDeviceName.trim()) {
        setStatusMsg({ type: 'error', text: '❌ Please enter a device name' });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        return;
      }

      setIsAdding(true);
      setStatusMsg({ type: '', text: '' }); // Clear previous messages
      
      try {
        await createDevice({
          name: newDeviceName.trim(),
          type: newDeviceType,
          consumption: newDeviceType === "water" ? 8.5 : 0.5, // Default consumption
          category: "OTHER",
          location: "Unknown"
        });
        
        // Success: Show green banner and clear form
        setStatusMsg({ type: 'success', text: '✅ Device connected successfully!' });
        setNewDeviceName("");
        setNewDeviceType("energy");
        
        // Clear success message after 3 seconds
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
      } catch (error) {
        // Error: Show red banner
        setStatusMsg({ type: 'error', text: '❌ Connection Failed' });
        
        // Clear error message after 5 seconds
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <DashboardLayout activeTab={currentView} onTabChange={setCurrentView}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Smart Devices</h1>
              <p className="text-xs text-slate-400">Manage your connected appliances</p>
            </div>
          </div>

          {/* Create Device Form */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Add New Device</h2>
            <form onSubmit={handleCreateDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="e.g., Bedroom Fan"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  disabled={isAdding}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Device Type
                </label>
                <select
                  value={newDeviceType}
                  onChange={(e) => setNewDeviceType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  disabled={isAdding}
                >
                  <option value="energy">Energy</option>
                  <option value="water">Water</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isAdding || !newDeviceName.trim()}
                className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {isAdding ? "Adding Device..." : "Add Device"}
              </button>
              
              {/* Status Message Banner */}
              {statusMsg.text && (
                <div
                  className={`mt-4 px-4 py-3 rounded-lg border transition-all duration-300 ${
                    statusMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {statusMsg.text}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Device List */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-slate-200">Connected Appliances</div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs text-slate-400 font-medium">Live</div>
              </div>
            </div>
            <DeviceList 
              devices={devices} 
              onDeviceUpdated={toggleDevice}
              onEcoModeToggle={toggleEcoMode}
              onDelete={deleteDevice}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Settings View
  if (currentView === "settings") {
    return (
      <DashboardLayout activeTab={currentView} onTabChange={setCurrentView}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Settings</h1>
              <p className="text-xs text-slate-400">Set conservation goals</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-slate-200 mb-6">Conservation Goals</h2>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <label className="text-sm font-medium text-slate-300">
                      Daily Energy Limit
                    </label>
                  </div>
                  <span className="text-lg font-bold text-emerald-500">
                    {limits.energy} kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={limits.energy}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    updateLimits("energy", value); // Update local state instantly
                  }}
                  onMouseUp={(e) => {
                    const value = parseInt(e.target.value, 10);
                    saveSettings("energy", value); // Save to backend when user releases mouse
                  }}
                  onTouchEnd={(e) => {
                    const value = parseInt(e.target.value, 10);
                    saveSettings("energy", value); // Save to backend on touch devices
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5 kWh</span>
                  <span>50 kWh</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-sky-400" />
                    <label className="text-sm font-medium text-slate-300">
                      Daily Water Limit
                    </label>
                  </div>
                  <span className="text-lg font-bold text-sky-400">
                    {limits.water} L
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="1"
                  value={limits.water}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    updateLimits("water", value); // Update local state instantly
                  }}
                  onMouseUp={(e) => {
                    const value = parseInt(e.target.value, 10);
                    saveSettings("water", value); // Save to backend when user releases mouse
                  }}
                  onTouchEnd={(e) => {
                    const value = parseInt(e.target.value, 10);
                    saveSettings("water", value); // Save to backend on touch devices
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50 L</span>
                  <span>200 L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Default: Overview Dashboard
  return (
    <DashboardLayout activeTab={currentView} onTabChange={setCurrentView}>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-slate-50 mb-1">
          Conservation Command Center
        </h1>
        <p className="text-xs text-slate-400">Monitor and control Energy & Water consumption</p>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400 font-medium">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Top KPI Section */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 md:col-span-3">
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <div className="text-xs font-bold text-slate-200">Current Load</div>
                </div>
                <div className="text-2xl font-bold text-emerald-500 mb-1">
                  {totalCurrentLoad.toFixed(2)} kW
                </div>
                <div className="text-[10px] text-slate-400">
                  {devices.filter((d) => d.isOn || d.status === "ON").length} devices running
                </div>
              </div>
            </div>

        <div className="col-span-12 md:col-span-3">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              <div className="text-xs font-bold text-slate-200">Water Usage</div>
            </div>
            <div className="text-2xl font-bold text-sky-400 mb-1">
              {totalWaterUsage.toFixed(0)} L
            </div>
            <div className="text-[10px] text-slate-400">
              Goal: {limits.water} L/day
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <div className="text-xs font-bold text-slate-200">Est. Daily Cost</div>
            </div>
            <div className="text-2xl font-bold text-amber-500 mb-1">
              ₹{((totalCurrentLoad * 24) * electricityRate).toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400">
              Per day
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-slate-200">Conservation Score</div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              85%
            </div>
            <div className="text-[10px] text-slate-400">
              Efficiency rating
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Single Unified Chart - Spans 8 columns */}
        <div className="col-span-12 lg:col-span-8">
          <ConservationChart
            energyData={historyData.energy}
            waterData={historyData.water}
            energyLimit={limits.energy}
            waterLimit={limits.water}
          />
        </div>

        {/* Device List */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-slate-200">Connected Appliances</div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs text-slate-400 font-medium">Live</div>
              </div>
            </div>
            <DeviceList 
              devices={devices} 
              onDeviceUpdated={toggleDevice}
              onEcoModeToggle={toggleEcoMode}
              onDelete={deleteDevice}
            />
          </div>
        </div>
      </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SimplifiedDashboard;
