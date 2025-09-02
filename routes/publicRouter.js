const express = require('express');
const router = express.Router();
const { 
  getStructuredCategories, // ✅ Fixed spelling
  getAllCategories, 
  getFilteredPosts, 
  posts, 
  postDetails, 
  latestPosts 
} = require('../controllers/publicController');

router.get('/posts', posts);
router.get('/post/:id', postDetails);
router.get('/posts/filter', getFilteredPosts);
router.get('/posts/latest', latestPosts);
router.get('/categories', getAllCategories);
router.get('/categories/structured', getStructuredCategories); // ✅ Fixed route path

module.exports = router;