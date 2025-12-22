// src/components/DeviceCard.jsx
// Frontend-Only Component - No API calls
import React from "react";
import { Zap, Lightbulb, Thermometer, Snowflake, Droplet, Trash2 } from "lucide-react";

const DeviceCard = ({ device, onToggle, onEcoModeToggle, onDelete }) => {
  // Handle both new format (isOn) and legacy format (status)
  const isOn = device.isOn !== undefined ? device.isOn : device.status === "ON";
  const ecoMode = device.isEco !== undefined ? device.isEco : device.ecoMode || false;
  const powerKw = device.currentPowerKw || device.consumption || 0;
  const consumption = device.consumption || 0; // Actual consumption rate from device
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle(device._id);
    }
  };

  const handleEcoModeToggle = () => {
    if (onEcoModeToggle && isOn) {
      onEcoModeToggle(device._id);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${device.name}"?`)) {
      onDelete(device._id);
    }
  };

  const getDeviceIcon = () => {
    const name = device.name?.toLowerCase() || '';
    const category = device.category?.toLowerCase() || '';

    if (name.includes('light') || name.includes('lamp') || category === 'lighting') {
      return <Lightbulb className="w-4 h-4" />;
    }
    if (name.includes('ac') || name.includes('air') || name.includes('cool') || category === 'hvac') {
      return <Snowflake className="w-4 h-4" />;
    }
    if (name.includes('heat') || name.includes('heater') || name.includes('thermo') || category === 'water_heater') {
      return <Thermometer className="w-4 h-4" />;
    }
    if (name.includes('water') || name.includes('pump') || name.includes('washer') || name.includes('sprinkler')) {
      return <Droplet className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  const isWaterDevice = () => {
    const name = device.name?.toLowerCase() || '';
    return name.includes('water') || name.includes('pump') || name.includes('washer') || name.includes('sprinkler');
  };

  const getConsumptionRate = () => {
    if (isWaterDevice() || device.type === 'water') {
      // Show actual consumption rate from device data
      return isOn ? `${consumption.toFixed(1)}L/min` : "0L/min";
    } else {
      // For energy devices, show current power when on, consumption rate when off
      return isOn ? `${powerKw.toFixed(2)}kW` : `${consumption.toFixed(2)}kW`;
    }
  };

  const shouldShowCategory = device.category && device.category !== 'OTHER' && device.category !== 'Unknown';

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-800/50 rounded-lg p-3 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className={`${isOn ? "text-emerald-500" : "text-slate-500"} transition-colors flex-shrink-0`}>
              {getDeviceIcon()}
            </div>
            <div className={`text-xs font-bold ${isOn ? "text-slate-50" : "text-slate-400"} transition-colors truncate`}>
              {device.name}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {shouldShowCategory && <span>{device.category}</span>}
            {shouldShowCategory && device.location && device.location !== 'Unknown' && <span> · </span>}
            {device.location && device.location !== 'Unknown' && <span>{device.location}</span>}
            {!shouldShowCategory && (!device.location || device.location === 'Unknown') && <span className="text-slate-500">—</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <div className="text-right">
            <div className={`text-xs font-bold ${isOn ? (isWaterDevice() ? "text-sky-400" : "text-emerald-500") : "text-slate-400"}`}>
              {isOn ? "ON" : "OFF"}
            </div>
            <div className={`text-[10px] font-medium mt-0.5 ${isOn ? (isWaterDevice() ? "text-sky-400" : "text-emerald-500") : "text-slate-400"}`}>
              {getConsumptionRate()}
            </div>
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
              title="Delete device"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/50 space-y-2">
        {/* Eco Mode Badge/Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleEcoModeToggle}
            disabled={!isOn}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              ecoMode && isOn
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
            } ${!isOn ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700/50"}`}
          >
            <span>🌱</span>
            <span>Eco Mode</span>
          </button>

          {/* iOS-style Toggle Switch - Compact */}
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-1 focus:ring-offset-slate-900 ${
              isOn ? (isWaterDevice() ? "bg-sky-500" : "bg-emerald-500") : "bg-slate-700"
            }`}
            role="switch"
            aria-checked={isOn}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                isOn ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Last Updated */}
        <div className="text-[10px] text-slate-500 text-center">
          {device.lastToggledAt ? (
            <span>{new Date(device.lastToggledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          ) : (
            <span>—</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
