import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Gagal mengambil detail resep:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5] font-black text-pink-500">
      Memuat Detail FoodCost... 👩‍🍳
    </div>
  );

  if (!recipe) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-bold">
      Resep tidak ditemukan! 🥺 
      <button onClick={() => navigate('/')} className="ml-4 text-pink-500 underline">Kembali</button>
    </div>
  );

  // Variabel untuk perhitungan sesuai request
  const vJual = Number(recipe.jual) || 0;
  const vPorsi = Number(recipe.porsi) || 0;
  const vModal = Number(recipe.modal) || 0;
  const totalOmzet = vJual * vPorsi;
  const untungBersih = totalOmzet - vModal;

  return (
    <div className="min-h-screen bg-white font-['Quicksand'] pb-20 text-[#1B263B]">
      {/* Banner Foto Menu */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={recipe.image} 
          className="w-full h-full object-cover shadow-inner" 
          alt={recipe.nama} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-12">
          <h1 className="text-5xl font-black text-white tracking-tight">{recipe.nama}</h1>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-10"
        >
          ⬅️ Kembali
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Kolom Kiri: Resep & Langkah */}
        <div className="space-y-10">
          <section className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="bg-white p-2 rounded-xl shadow-sm">📋</span> Resep & Bahan
            </h3>
            <p className="whitespace-pre-line leading-relaxed text-slate-700 font-medium">
              {recipe.bahan || "Data bahan belum tersedia."}
            </p>
          </section>

          <section className="bg-orange-50 p-10 rounded-[3rem] border-2 border-orange-100 shadow-sm">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="bg-white p-2 rounded-xl shadow-sm">👩‍🍳</span> Cara Membuat
            </h3>
            <p className="whitespace-pre-line leading-relaxed text-slate-700 font-medium">
              {recipe.langkah || "Langkah pembuatan belum tersedia."}
            </p>
          </section>
        </div>

        {/* Kolom Kanan: Rincian Perhitungan dengan Rumus Sesuai Request */}
        <div className="bg-[#1B263B] text-white p-12 rounded-[4rem] h-fit sticky top-24 shadow-2xl border-x-4 border-pink-300">
          <h3 className="text-3xl font-black text-center mb-12 italic tracking-wide">
            Rincian Perhitungan 📊
          </h3>
          
          <div className="space-y-8 text-lg font-medium">
            {/* Harga Jual per Porsi */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="opacity-70 italic">💸 Harga Jual</span>
              <span className="font-bold">Rp {vJual.toLocaleString()} / porsi</span>
            </div>
            
            {/* Rumus Keuntungan/Omzet */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="opacity-70 italic">📈 Keuntungan ({vPorsi} porsi × {vJual.toLocaleString()})</span>
              <span className="font-bold text-yellow-400">Rp {totalOmzet.toLocaleString()}</span>
            </div>

            {/* Modal Produksi */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="opacity-70 italic">📉 Modal Produksi</span>
              <span className="font-bold text-rose-400">Rp {vModal.toLocaleString()}</span>
            </div>

            {/* Kotak Hasil Akhir */}
            <div className="bg-white text-[#1B263B] p-10 rounded-[3.5rem] text-center mt-12 shadow-2xl transform hover:scale-105 transition-transform">
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-3 opacity-40">Untung Bersih Akhir</p>
              <h4 className="text-4xl font-black text-emerald-500">
                ± Rp {untungBersih.toLocaleString()} ✨
              </h4>
              <p className="text-[10px] mt-3 italic text-slate-400 font-bold uppercase">
                *Sudah dikurangi total modal produksi
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}