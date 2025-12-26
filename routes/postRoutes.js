const express = require('express');
const {
    createPost,
    getPost,
    getPosts,
    getPostByAuthor,
    updatePost,
    deletePost,
    getPostsByAdmin,
} = require('../controllers/postController');
const upload = require('../config/Cloudinay');
const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(upload.single('image'), createPost);

router.get('/admin', getPostsByAdmin);

router.route('/:id')
    .get(getPost)
    .put(upload.single('image'), updatePost)
    .delete(deletePost)


router.get('/author/:authorId', getPostByAuthor);


module.exports = router;