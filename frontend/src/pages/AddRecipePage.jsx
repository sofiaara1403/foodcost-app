import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Save, UtensilsCrossed, Image as ImageIcon, DollarSign } from 'lucide-react';

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [namaMenu, setNamaMenu] = useState('');
  const [fotoMakanan, setFotoMakanan] = useState('');
  const [resepSingkat, setResepSingkat] = useState('');
  const [caraMembuat, setCaraMembuat] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  
  // State untuk bahan-bahan (Array of Objects)
  const [bahanBahan, setBahanBahan] = useState([
    { nama: '', harga_modal_satuan: '', jumlah_digunakan: 1 }
  ]);

  const addBahan = () => {
    setBahanBahan([...bahanBahan, { nama: '', harga_modal_satuan: '', jumlah_digunakan: 1 }]);
  };

  const removeBahan = (index) => {
    const newBahan = bahanBahan.filter((_, i) => i !== index);
    setBahanBahan(newBahan);
  };

  const handleBahanChange = (index, field, value) => {
    const newBahan = [...bahanBahan];
    newBahan[index][field] = value;
    setBahanBahan(newBahan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        nama_menu: namaMenu,
        foto_makanan: fotoMakanan,
        resep_makanan: resepSingkat,
        cara_membuat: caraMembuat,
        bahan_bahan: bahanBahan,
        harga_jual: Number(hargaJual)
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/recipes`, dataToSubmit, { withCredentials: true });
      alert("Resep berhasil disimpan! ✨");
      navigate('/');
    } catch (err) {
      alert("Gagal simpan resep. Cek lagi ya!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-blue-50">
        <div className="text-center mb-10">
          <h2 className="font-cute text-4xl text-[#2C3E50] mb-2">Tambah Resep Baru</h2>
          <p className="text-gray-500 italic">"Catat resep rahasiamu dan biarkan kami hitung cuannya!"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-[#2C3E50] ml-2"><UtensilsCrossed size={18}/> Nama Menu</label>
              <input 
                type="text" 
                placeholder="Misal: Es Kopi Susu" 
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-light-blue-accent outline-none"
                value={namaMenu} onChange={(e) => setNamaMenu(e.target.value)} required 
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-[#2C3E50] ml-2"><ImageIcon size={18}/> URL Foto Makanan</label>
              <input 
                type="text" 
                placeholder="Link foto dari internet" 
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-light-blue-accent outline-none"
                value={fotoMakanan} onChange={(e) => setFotoMakanan(e.target.value)}
              />
            </div>
          </div>

          {/* Resep & Cara Membuat */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-[#2C3E50] ml-2">Ringkasan Resep</label>
              <textarea 
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-light-blue-accent outline-none h-24"
                placeholder="List bahan secara singkat..."
                value={resepSingkat} onChange={(e) => setResepSingkat(e.target.value)} required
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-[#2C3E50] ml-2">Cara Membuat</label>
              <textarea 
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-light-blue-accent outline-none h-32"
                placeholder="Langkah-langkah memasak..."
                value={caraMembuat} onChange={(e) => setCaraMembuat(e.target.value)} required
              />
            </div>
          </div>

          {/* Input Bahan-Bahan Dinamis */}
          <div className="bg-blue-50 p-6 rounded-[2rem] space-y-4">
            <h3 className="font-bold text-[#2C3E50] flex justify-between items-center">
              Daftar Harga Bahan (Modal)
              <button type="button" onClick={addBahan} className="bg-white text-light-blue-accent p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
                <Plus size={20}/>
              </button>
            </h3>
            
            {bahanBahan.map((bahan, index) => (
              <div key={index} className="flex gap-3 items-center animate-fade-in">
                <input 
                  type="text" placeholder="Nama Bahan" 
                  className="flex-[2] px-4 py-2 rounded-xl border-none shadow-sm outline-none"
                  value={bahan.nama} onChange={(e) => handleBahanChange(index, 'nama', e.target.value)} required
                />
                <input 
                  type="number" placeholder="Harga Modal" 
                  className="flex-[1] px-4 py-2 rounded-xl border-none shadow-sm outline-none"
                  value={bahan.harga_modal_satuan} onChange={(e) => handleBahanChange(index, 'harga_modal_satuan', e.target.value)} required
                />
                {bahanBahan.length > 1 && (
                  <button type="button" onClick={() => removeBahan(index)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={20}/>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Harga Jual */}
          <div className="space-y-2 max-w-xs mx-auto text-center">
            <label className="flex items-center justify-center gap-2 font-bold text-[#2C3E50]"><DollarSign size={18}/> Harga Jual Final</label>
            <input 
              type="number" 
              placeholder="Rp 0" 
              className="w-full px-5 py-4 rounded-2xl bg-[#2C3E50] text-white text-center text-2xl font-bold shadow-xl outline-none"
              value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-light-blue-accent hover:bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-1"
          >
            <Save size={20}/> Simpan Resep & Hitung Untung
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipePage;