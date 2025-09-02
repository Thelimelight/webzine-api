const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getStructuredCategories } = require('../controllers/publicController');
const {
  getAllCategories,
  create,
  deleteCategory
} = require('../controllers/categoryController');

router.get('/', authenticate, getAllCategories);
router.get('/structured', getStructuredCategories); // ✅ Fixed function name
router.post('/create', authenticate, create);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;