const express = require('express');
const {
    createAuthor,
    getAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
} = require('../controllers/authorController');
const router = express.Router();
const upload = require('../config/Cloudinay');
router.route('/')
    .get(getAuthors)
    .post(upload.single('image') ,createAuthor);

router.route('/:id')
    .get(getAuthor)
    .put(updateAuthor)
    .delete(deleteAuthor);

module.exports = router;