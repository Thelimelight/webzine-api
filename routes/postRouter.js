const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const upload = require('../middleware/multer')
const { create, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { posts } = require('../controllers/adminController')

// Routes

// Get
router.get('/posts', authenticate, posts);
router.get('/posts/:id', authenticate, getPostById)

// Post
router.post('/upload', authenticate, upload.single('image'), create);

// Update
router.put('/posts/:id', upload.single('image'), authenticate, updatePost);

// Delete
router.delete('/posts/:id', authenticate, deletePost);


module.exports = router;