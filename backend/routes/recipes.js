const express = require('express');
const { protect } = require('../middleware/auth');
const Recipe = require('../models/Recipe');

const router = express.Router();

// @desc    Get all recipes for logged in user
// @route   GET /api/recipes
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
router.post('/', protect, async (req, res) => {
    const { nama_menu, foto_makanan, resep_makanan, cara_membuat, bahan_bahan, harga_jual } = req.body;

    if (!nama_menu || !resep_makanan || !cara_membuat || !bahan_bahan || !harga_jual) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        const recipe = new Recipe({
            user: req.user._id,
            nama_menu,
            foto_makanan,
            resep_makanan,
            cara_membuat,
            bahan_bahan,
            harga_jual
        });

        const createdRecipe = await recipe.save(); // pre('save') akan menghitung total_modal & keuntungan
        res.status(201).json(createdRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { nama_menu, foto_makanan, resep_makanan, cara_membuat, bahan_bahan, harga_jual } = req.body;

    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });

        if (recipe) {
            recipe.nama_menu = nama_menu || recipe.nama_menu;
            recipe.foto_makanan = foto_makanan || recipe.foto_makanan;
            recipe.resep_makanan = resep_makanan || recipe.resep_makanan;
            recipe.cara_membuat = cara_membuat || recipe.cara_membuat;
            recipe.bahan_bahan = bahan_bahan || recipe.bahan_bahan;
            recipe.harga_jual = harga_jual || recipe.harga_jual;

            // Recalculate total_modal and keuntungan on update
            let calculatedTotalModal = 0;
            recipe.bahan_bahan.forEach(bahan => {
                calculatedTotalModal += bahan.harga_modal_satuan * bahan.jumlah_digunakan;
            });
            recipe.total_modal = calculatedTotalModal;
            recipe.keuntungan = recipe.harga_jual - recipe.total_modal;


            const updatedRecipe = await recipe.save();
            res.json(updatedRecipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });

        if (recipe) {
            await Recipe.deleteOne({ _id: req.params.id }); // Menggunakan deleteOne()
            res.json({ message: 'Recipe removed' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;