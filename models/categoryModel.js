const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true, 
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, 
    }
})

module.exports = new mongoose.model('Category', categorySchema);