// src/layouts/MainLayout.jsx
import React from "react";
import Header from "../components/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default MainLayout;
