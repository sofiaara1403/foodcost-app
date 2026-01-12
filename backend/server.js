const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
// Membuka akses agar frontend (Vite) bisa berkomunikasi dengan backend
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// --- KONEKSI DATABASE ---
// Menghubungkan aplikasi ke Cloud MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DATABASE TERHUBUNG (MongoDB Atlas)'))
  .catch(err => console.log('❌ KONEKSI GAGAL:', err));

// --- SCHEMAS & MODELS ---

// Model untuk Akun User (Digunakan saat Login/Register)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Model Lengkap untuk Resep & Keuntungan
const RecipeSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  image: { type: String, required: true },
  modal: { type: Number, required: true },  // Total Modal (ex: 103000)
  jual: { type: Number, required: true },   // Harga Jual per Porsi (ex: 20000)
  porsi: { type: Number, required: true },  // Jumlah Porsi (ex: 10)
  bahan: { type: String, default: "" },     // Detail Bahan Baku
  langkah: { type: String, default: "" },   // Cara Memasak
  createdBy: { type: String, required: true }
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

// --- AUTH ROUTES (REGISTER & LOGIN) ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) return res.status(400).json({ message: "Username sudah terpakai" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username: username.toLowerCase(), password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Akun Berhasil Dibuat! ✨" });
  } catch (err) {
    res.status(500).json({ message: "Gagal register" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id }, "SECRET_UAS_MERN", { expiresIn: '1d' });
    res.json({ token, username: user.username, message: "Login Berhasil! 🚀" });
  } catch (err) {
    res.status(500).json({ message: "Error saat login" });
  }
});

// --- RECIPE ROUTES (Data Makanan & Hitung Cuan) ---

// Ambil SEMUA resep untuk Dashboard
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data" });
  }
});

// Ambil SATU detail resep untuk halaman DetailsPage
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error mengambil detail" });
  }
});

// Simpan Resep Baru (Lengkap dengan Bahan & Langkah)
app.post('/api/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: "Gagal simpan resep" });
  }
});

// Hapus Resep
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus" });
  }
});

// --- AUTO-ADMIN SETUP ---
// Akun demo otomatis agar dosen mudah memeriksa UAS kamu
const seedAdmin = async () => {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    const hash = await bcrypt.hash('password123', 10);
    await User.create({ username: 'admin', password: hash });
    console.log("🚀 AKUN DEMO SIAP: admin | password123");
  }
};
seedAdmin();

// --- JALANKAN SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Backend menyala di port: ${PORT}`));