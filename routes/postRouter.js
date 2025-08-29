const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const upload = require('../middleware/multer');
const { create, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { posts } = require('../controllers/adminController');

router.get('/posts', authenticate, posts);
router.get('/posts/:id', authenticate, getPostById);
router.post('/upload', authenticate, upload.single('image'), create);
router.put('/posts/:id', upload.single('image'), authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);

module.exports = router;