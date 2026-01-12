import React from 'react';

export default function Navbar() {
  return (
    <nav className="px-8 py-5 flex justify-between items-center bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-navy-deep/5 font-cute">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <h1 className="text-2xl font-bold text-navy-deep tracking-tighter">
          Recipe<span className="text-navy-light opacity-80">Costing</span>
        </h1>
      </div>
      <div className="flex gap-4 items-center">
        <button className="px-5 py-2 rounded-xl text-navy-deep font-bold hover:bg-navy-deep hover:text-white transition-all">Dashboard</button>
        <button className="px-5 py-2 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all">Logout</button>
      </div>
    </nav>
  );
}