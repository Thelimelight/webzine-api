// ✅ Line 1
const express = require('express');
const router = express.Router();

// ✅ Line 2–3: Fix import order and validate exports
const authenticate = require('../middleware/auth');
const { getStructuredCategories } = require('../controllers/publicController')
const {
  getAllCategories,
  create,
  deleteCategory
} = require('../controllers/categoryController');

// ✅ Line 6
router.get('/', authenticate, getAllCategories);

// ✅ Line 7 — this was likely the broken line
router.get('/structured', getStructuredCategories); // 🔧 Make sure getStructuredCategories is defined

// ✅ Line 8
router.post('/create', authenticate, create);

// ✅ Line 9
router.delete('/:id', authenticate, deleteCategory);

// ✅ Line 10
module.exports = router;