import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Pizza, 
  Coffee, 
  LayoutDashboard, 
  ChevronRight 
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari Backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`, { withCredentials: true });
        setRecipes(res.data);
      } catch (err) {
        console.error("Gagal ambil data resep", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Hitung Rata-rata Keuntungan untuk Analytics
  const avgProfit = recipes.length > 0 
    ? recipes.reduce((acc, curr) => acc + curr.keuntungan, 0) / recipes.length 
    : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen font-cute text-2xl text-[#2C3E50]">
      <div className="animate-spin mb-4"><Coffee size={48} /></div>
      Menyiapkan Dapur Aesthetic...
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. Hero Section: Judul & Penjelasan Santai */}
      <header className="text-center py-16 px-4 animate-reveal">
        <h1 className="font-cute text-7xl text-[#2C3E50] mb-6 drop-shadow-sm">
          Recipe Costing
        </h1>
        <p className="font-sans text-xl text-[#3F515B] max-w-2xl mx-auto leading-relaxed italic">
          Halo para pejuang cuan! 👋 Capek ngitung manual harga jualan? Tenang, di sini kamu bisa 
          simpan resep rahasiamu sekaligus hitung modal & untung secara otomatis. 
          Biar bisnis kulinermu makin rapi dan makin aesthetic! ✨
        </p>
      </header>

      {/* 2. Analytics Header: Ringkasan Bisnis (Mind-blowing Part) */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card Total Menu */}
          <div className="glass-card bg-gradient-to-br from-[#2C3E50] to-[#34495E] p-8 rounded-[2.5rem] text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                <Pizza className="text-yellow-400" size={32} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Total Koleksi</p>
                <h4 className="text-4xl font-bold">{recipes.length} <span className="text-lg font-light">Menu</span></h4>
              </div>
            </div>
          </div>

          {/* Card Rata-rata Untung */}
          <div className="glass-card bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-green-50 rounded-2xl">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Rata-rata Cuan</p>
                <h4 className="text-3xl font-bold text-[#2C3E50]">
                  Rp {Math.round(avgProfit).toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          {/* Card Status */}
          <div className="glass-card bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 rounded-2xl">
                <LayoutDashboard size={32} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Status Bisnis</p>
                <h4 className="text-2xl font-bold">Siap Jualan! 🔥</h4>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Main Content: Grid Kartu Resep */}
      <section className="container mx-auto px-4">
        <h2 className="font-display text-3xl text-[#2C3E50] mb-10 ml-4 flex items-center gap-3">
          Menu Andalan Kamu <ChevronRight className="text-light-blue-accent" />
        </h2>

        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg italic">Belum ada resep nih. Yuk tambah menu pertama kamu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="relative group animate-reveal">
                
                {/* Badge Paling Cuan */}
                {recipe.keuntungan > 15000 && (
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-[#2C3E50] px-6 py-2 rounded-full text-sm font-black z-20 shadow-xl animate-bounce">
                    ⭐ PALING CUAN!
                  </div>
                )}
                
                <div className="glass-card rounded-[3rem] overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-4 border border-white bg-white/80 backdrop-blur-lg">
                  {/* Image wrapper */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={recipe.foto_makanan || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500"} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={recipe.nama_menu}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-all duration-500 flex items-end p-8">
                      <p className="text-white text-sm font-medium tracking-wide">Klik rincian untuk bedah modal produksi...</p>
                    </div>
                  </div>
                  
                  {/* Card Info */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">{recipe.nama_menu}</h3>
                    <div className="flex justify-between items-end mt-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Estimasi Profit</p>
                        <p className="text-2xl font-black text-green-600">Rp {recipe.keuntungan.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/recipe/${recipe._id}`)} 
                        className="bg-[#2C3E50] text-white p-4 rounded-[1.5rem] hover:bg-light-blue-accent transition-all shadow-lg active:scale-90 hover:rotate-12"
                      >
                        <ArrowRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Floating Action Button (FAB) */}
      <button 
        onClick={() => navigate('/add')}
        className="fixed bottom-12 right-12 bg-[#2C3E50] text-white w-20 h-20 rounded-full shadow-[0_20px_50px_rgba(44,62,80,0.3)] flex items-center justify-center hover:bg-light-blue-accent hover:rotate-90 transition-all duration-500 z-50 group"
      >
        <Plus size={40} />
        <span className="absolute right-24 bg-[#2C3E50] text-white px-6 py-3 rounded-2xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
          Tambah Menu Baru ✨
        </span>
      </button>

    </div>
  );
};

export default HomePage;