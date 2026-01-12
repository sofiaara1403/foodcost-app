import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { 
        username: username.toLowerCase(), 
        password 
      });

      // SIMPAN DATA PENTING
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      
      alert(res.data.message);
      
      // PAKSA PINDAH KE DASHBOARD
      navigate("/dashboard"); 
      // Jika route utama kamu adalah "/", ganti jadi navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Quicksand'] relative overflow-hidden">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md z-10 border-b-8 border-[#1B263B]">
        <h1 className="text-3xl font-bold text-[#1B263B] text-center mb-2">Welcome Back!</h1>
        <p className="text-center text-slate-500 mb-8">Siap hitung cuan? 💸</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Username" className="w-full px-5 py-4 rounded-2xl bg-slate-100 outline-none" 
            onChange={(e)=>setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full px-5 py-4 rounded-2xl bg-slate-100 outline-none" 
            onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" className="w-full py-4 bg-[#1B263B] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Masuk Sekarang 🚀
          </button>
        </form>
      </div>
    </div>
  );
}