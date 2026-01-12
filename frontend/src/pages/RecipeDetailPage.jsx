import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-pink-500 bg-[#FFF0F5]">Memuat Detail FoodCost... 👩‍🍳</div>;
  if (!recipe) return <div className="text-center mt-20 font-bold">Resep tidak ditemukan! 🥺 <button onClick={() => navigate('/')}>Kembali</button></div>;

  {/* LOGIKA PERHITUNGAN SESUAI REQUEST */}
  const vJual = Number(recipe.jual);
  const vPorsi = Number(recipe.porsi);
  const vModal = Number(recipe.modal);
  const totalOmzet = vJual * vPorsi;
  const untungBersih = totalOmzet - vModal;

  return (
    <div className="min-h-screen bg-white font-['Quicksand'] pb-20">
      {/* Banner Atas */}
      <div className="relative h-96">
        <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.nama} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-12">
          <h1 className="text-5xl font-black text-white">{recipe.nama}</h1>
        </div>
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 bg-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all">⬅️ Kembali</button>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Kolom Kiri: Resep */}
        <div className="space-y-10">
          <section className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-[#1B263B]">📋 Resep & Bahan</h3>
            <p className="whitespace-pre-line leading-relaxed text-slate-700 font-medium">
              {recipe.bahan || "Data bahan belum diisi."}
            </p>
          </section>

          <section className="bg-orange-50 p-8 rounded-[3rem] border-2 border-orange-100 shadow-sm">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-[#1B263B]">👩‍🍳 Cara Membuat</h3>
            <p className="whitespace-pre-line leading-relaxed text-slate-700 font-medium">
              {recipe.langkah || "Data langkah belum diisi."}
            </p>
          </section>
        </div>

        {/* Kolom Kanan: Rincian Keuntungan Sesuai Request */}
        <div className="bg-[#1B263B] text-white p-10 rounded-[4rem] h-fit sticky top-24 shadow-2xl border-x-4 border-pink-300">
          <h3 className="text-3xl font-black text-center mb-10 italic border-b border-white/10 pb-6">Rincian Perhitungan 📊</h3>
          
          <div className="space-y-6 text-lg font-medium">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="opacity-70 italic">💸 Harga Jual</span>
              <span className="font-bold">Rp {vJual.toLocaleString()} / porsi</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="opacity-70 italic">📈 Total Omzet ({vPorsi} Porsi)</span>
              <span className="font-bold text-yellow-400">Rp {totalOmzet.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="opacity-70 italic">📉 Modal Produksi</span>
              <span className="font-bold text-rose-400">Rp {vModal.toLocaleString()}</span>
            </div>

            {/* Hasil Akhir */}
            <div className="bg-white text-[#1B263B] p-8 rounded-[3rem] text-center mt-12 shadow-inner">
              <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-50">Untung Bersih Akhir</p>
              <h4 className="text-4xl font-black text-emerald-500">
                ± Rp {untungBersih.toLocaleString()} ✨
              </h4>
              <p className="text-[10px] mt-2 italic text-slate-400">*Setelah dikurangi total modal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}