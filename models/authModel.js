const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    profileImage: {
        type: String, 
        default: 'https://www.gravatar.com/avatar',
        trim: true,
    },
    password: {
        type:String, 
        required: true,
        trim: true,
    },
    role: {
        type: String, 
        enum: ['admin', 'editor', 'associateEditor' ],
        default: "admin",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('User', authSchema);