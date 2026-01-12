import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  
  // State untuk Form
  const [namaMenu, setNamaMenu] = useState("");
  const [linkFoto, setLinkFoto] = useState(""); // Ini yang kita pastikan jalan
  const [modal, setModal] = useState(""); 
  const [jual, setJual] = useState("");   
  const [porsi, setPorsi] = useState(""); 
  const [bahan, setBahan] = useState("");   
  const [langkah, setLangkah] = useState(""); 

  useEffect(() => { 
    fetchRecipes(); 
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/recipes");
      setRecipes(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Gagal mengambil data, pastikan backend sudah 'npm run dev'"); 
    }
  };

  const tambahMenu = async (e) => {
    e.preventDefault();
    try {
      // Mengirim data ke database
      await axios.post("http://localhost:5000/api/recipes", {
        nama: namaMenu,
        image: linkFoto,
        modal: Number(modal),
        jual: Number(jual),
        porsi: Number(porsi),
        bahan: bahan,
        langkah: langkah,
        createdBy: "Chef"
      });
      
      alert("Menu Berhasil Disimpan! ✨");
      
      // Reset Form setelah simpan
      setNamaMenu(""); 
      setLinkFoto(""); 
      setModal(""); 
      setJual(""); 
      setPorsi(""); 
      setBahan(""); 
      setLangkah("");
      
      fetchRecipes(); // Refresh daftar menu
    } catch (err) { 
      alert("Gagal simpan ke database"); 
    }
  };

  const hapusResep = async (id) => {
    if (window.confirm("Hapus menu ini? 🥺")) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`);
        fetchRecipes();
      } catch (err) { 
        console.error(err); 
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-['Quicksand'] pb-20 text-[#1B263B]">
      {/* Navbar Atas */}
      <nav className="bg-[#1B263B] text-white p-5 flex justify-between items-center shadow-2xl sticky top-0 z-50 border-b-4 border-pink-300">
        <h1 className="text-2xl font-black italic">🍲 FoodCost</h1>
        <button 
          onClick={() => { localStorage.clear(); navigate("/login"); }} 
          className="bg-[#FF4D6D] px-6 py-2 rounded-full text-sm font-black shadow-lg hover:bg-rose-600 transition-all"
        >
          Logout
        </button>
      </nav>

      {/* Header & Tagline */}
      <header className="mt-12 text-center px-6">
        <div className="bg-white p-10 rounded-[4rem] shadow-2xl inline-block border-x-8 border-pink-200 relative">
          <div className="absolute -top-6 -right-6 text-5xl animate-bounce">🎀</div>
          <h2 className="text-4xl font-black mb-2">FoodCost</h2>
          <p className="text-pink-500 font-bold italic">“Thoughtful recipes, mindful cost” 🧁🌸</p>
        </div>
      </header>

      {/* Form Tambah Menu */}
      <section className="mt-12 px-6 max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white">
          <h3 className="text-center font-black mb-6 text-xl">➕ Tambah Menu Baru</h3>
          <form onSubmit={tambahMenu} className="flex flex-col gap-4">
            
            {/* Input Nama */}
            <input 
              type="text" 
              placeholder="Nama Menu" 
              className="w-full px-6 py-4 rounded-3xl bg-pink-50/50 outline-none border border-pink-100 font-bold" 
              value={namaMenu} 
              onChange={(e) => setNamaMenu(e.target.value)} 
              required 
            />

            {/* Input Link Foto - SUDAH DIPERBAIKI */}
            <input 
              type="text" 
              placeholder="Link Foto 🔗" 
              className="w-full px-6 py-4 rounded-3xl bg-pink-50/50 outline-none border border-pink-100 font-bold" 
              value={linkFoto} 
              onChange={(e) => setLinkFoto(e.target.value)} 
              required 
            />

            {/* Input Perhitungan */}
            <div className="grid grid-cols-3 gap-3">
              <input 
                type="number" 
                placeholder="Modal Total" 
                className="px-5 py-4 rounded-3xl bg-blue-50/50 outline-none border border-blue-100 font-bold text-blue-600" 
                value={modal} 
                onChange={(e) => setModal(e.target.value)} 
                required 
              />
              <input 
                type="number" 
                placeholder="Harga Jual/Por" 
                className="px-5 py-4 rounded-3xl bg-green-50/50 outline-none border border-green-100 font-bold text-green-600" 
                value={jual} 
                onChange={(e) => setJual(e.target.value)} 
                required 
              />
              <input 
                type="number" 
                placeholder="Porsi" 
                className="px-5 py-4 rounded-3xl bg-purple-50/50 outline-none border border-purple-100 font-bold text-purple-600" 
                value={porsi} 
                onChange={(e) => setPorsi(e.target.value)} 
                required 
              />
            </div>

            <textarea 
              placeholder="Bahan-bahan..." 
              className="w-full px-6 py-4 rounded-3xl bg-yellow-50/50 border border-yellow-100 h-24 text-sm outline-none font-medium" 
              value={bahan} 
              onChange={(e) => setBahan(e.target.value)} 
            />
            
            <textarea 
              placeholder="Cara Membuat..." 
              className="w-full px-6 py-4 rounded-3xl bg-orange-50/50 border border-orange-100 h-32 text-sm outline-none font-medium" 
              value={langkah} 
              onChange={(e) => setLangkah(e.target.value)} 
            />

            <button 
              type="submit" 
              className="w-full py-5 rounded-[2rem] font-black text-white bg-[#1B263B] hover:bg-pink-500 transition-all shadow-xl"
            >
              Simpan & Hitung 🚀
            </button>
          </form>
        </div>
      </section>

      {/* Grid Kartu Menu */}
      <main className="mt-20 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {recipes.map((item) => {
          // Logika Perhitungan: (Jual * Porsi) - Modal
          const untungBersih = (Number(item.jual) * Number(item.porsi)) - Number(item.modal);

          return (
            <div key={item._id} className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl relative group border-b-[12px] border-pink-100">
              {/* Tombol Hapus */}
              <button 
                onClick={() => hapusResep(item._id)} 
                className="absolute top-4 right-4 bg-white/80 text-red-500 w-8 h-8 rounded-full shadow z-10 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              
              <img src={item.image} className="h-52 w-full object-cover" alt={item.nama} />
              
              <div className="p-8 text-center">
                <h3 className="text-xl font-black mb-3">{item.nama}</h3>
                <div className="bg-emerald-50 py-3 rounded-2xl mb-5 text-emerald-600 font-black text-sm">
                  Untung: +Rp {untungBersih.toLocaleString()} ✨
                </div>
                <button 
                  onClick={() => navigate(`/details/${item._id}`)} 
                  className="w-full py-4 bg-[#FF748D] text-white rounded-full font-black hover:bg-rose-500 transition-all shadow-md"
                >
                  Details ✨
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}