import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { username, password });
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Gagal daftar!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Quicksand'] relative overflow-hidden">
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🍩</div>
      <div className="absolute bottom-10 right-10 text-4xl animate-bounce">🍕</div>

      <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md z-10 border-t-8 border-[#1B263B]">
        <h1 className="text-3xl font-bold text-[#1B263B] text-center mb-2">Join Us! 👩‍🍳</h1>
        <p className="text-center text-slate-500 mb-8">Daftar akun sesukamu ✨</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Username" className="w-full px-5 py-4 rounded-2xl bg-slate-100 outline-none" onChange={(e)=>setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full px-5 py-4 rounded-2xl bg-slate-100 outline-none" onChange={(e)=>setPassword(e.target.value)} required />
          <button className="w-full py-4 bg-[#1B263B] text-white rounded-2xl font-bold hover:scale-105 transition-all">Buat Akun 🚀</button>
        </form>
        <p className="text-center mt-6">Sudah punya akun? <a href="/login" className="font-bold text-[#1B263B] underline">Login</a></p>
      </div>
    </div>
  );
}