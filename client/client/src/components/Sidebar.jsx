// src/components/Sidebar.jsx
// Simple Navigation Component - Just calls setView
import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Zap, 
  Droplets, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Smartphone
} from "lucide-react";

const Sidebar = ({ onCollapseChange, activeTab, onTabChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (newState) => {
    setCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", tab: "overview" },
    { icon: Zap, label: "Energy Grid", tab: "energy" },
    { icon: Droplets, label: "Water System", tab: "water" },
    { icon: Smartphone, label: "Smart Devices", tab: "devices" },
    { icon: Settings, label: "Settings", tab: "settings" },
  ];

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className={`bg-slate-900/95 border-r border-white/10 transition-all duration-300 ${
      collapsed ? "w-16" : "w-64"
    } flex flex-col h-screen fixed left-0 top-0 z-40`}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-50">Energy Core</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => handleCollapse(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-slate-200"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.tab;
          
          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-400" : ""}`} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-white/10 ${collapsed ? "text-center" : ""}`}>
        {!collapsed && (
          <div className="text-xs text-slate-500">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Active</span>
            </div>
            <div className="text-slate-600">v1.0.0</div>
          </div>
        )}
        {collapsed && (
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mx-auto" />
        )}
      </div>
    </div>
  );
};

export default Sidebar;

