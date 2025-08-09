const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String, 
        required: true,
        trim: true,
    },
    institution: {
        type: String, 
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    author: {
        type: String, 
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: false,
        trim: true,
    },
})

module.exports = mongoose.model('Post', postSchema);