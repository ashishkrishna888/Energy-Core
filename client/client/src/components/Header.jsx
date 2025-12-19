// src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-20 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center ring-2 ring-emerald-500/20">
            <span className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
          </div>
          <div>
            <div className="text-base font-bold text-emerald-500 tracking-tight">
              Smart Energy Core
            </div>
            <div className="text-xs text-slate-400 font-medium">MVP · Real-time device control</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:block text-sm text-right">
              <div className="text-slate-100 font-semibold">{user.name}</div>
              <div className="text-slate-400 text-xs">{user.email}</div>
            </div>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-700/50 bg-slate-800/50 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200 backdrop-blur-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
