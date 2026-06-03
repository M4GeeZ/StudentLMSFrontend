import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">
            Student<span className="text-cyan-400">LMS</span>
          </h1>
          <p className="text-sm text-slate-400">Modern MERN Stack Dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-slate-300">
            Hi, {user?.name}
          </span>
          <button
            onClick={logout}
            className="px-5 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;