const express = require('express');
const { getAllCategories, getStructuredCategories, create, deleteCategory } = require('../controllers/categoryController');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Route (GET)
router.get('/', authenticate, getAllCategories);
// router.get('/structured', getStructuredCategories)

// Route (POST)
router.post('/create', authenticate, create);

// Route (DELETE)
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;