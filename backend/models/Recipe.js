const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nama_menu: {
        type: String,
        required: true
    },
    foto_makanan: { // URL atau Base64
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    resep_makanan: { // Resep lengkap
        type: String,
        required: true
    },
    cara_membuat: {
        type: String,
        required: true
    },
    bahan_bahan: [ // Array of objects
        {
            nama: { type: String, required: true },
            harga_modal_satuan: { type: Number, required: true, min: 0 }, // Harga per satuan (misal: per gram, per ml)
            jumlah_digunakan: { type: Number, required: true, min: 0 } // Jumlah yang digunakan dalam resep
        }
    ],
    harga_jual: {
        type: Number,
        required: true,
        min: 0
    },
    total_modal: { // Akan dihitung oleh backend
        type: Number,
        default: 0
    },
    keuntungan: { // Akan dihitung oleh backend
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware untuk menghitung total_modal dan keuntungan sebelum disimpan
RecipeSchema.pre('save', function(next) {
    let calculatedTotalModal = 0;
    this.bahan_bahan.forEach(bahan => {
        calculatedTotalModal += bahan.harga_modal_satuan * bahan.jumlah_digunakan;
    });
    this.total_modal = calculatedTotalModal;
    this.keuntungan = this.harga_jual - this.total_modal;
    next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);