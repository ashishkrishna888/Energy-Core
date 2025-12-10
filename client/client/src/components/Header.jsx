// src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.7)]" />
          </span>
          <div>
            <div className="text-sm font-semibold text-emerald-400 tracking-wide">
              Smart Energy Core
            </div>
            <div className="text-xs text-slate-400">MVP · Real-time device control</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="text-xs text-right">
              <div className="text-slate-100 font-medium">{user.name}</div>
              <div className="text-slate-400 text-[11px]">{user.email}</div>
            </div>
          )}
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
