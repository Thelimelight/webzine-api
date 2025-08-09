const express = require('express');
const router = express.Router();
const { getStructuredCategories, getAllCategories, getFilteredPosts, posts, postDetails, latestPosts } = require('../controllers/publicController');

// Get
router.get('/posts', posts );
router.get('/post/:id', postDetails);
router.get('/posts/filter', getFilteredPosts)
router.get('/posts/latest', latestPosts);

router.get('/categories', getAllCategories);
router.get('/structured', getStructuredCategories);

module.exports = router;