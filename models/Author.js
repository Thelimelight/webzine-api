const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  institution: {
    type: String,
    default: '',
  },
  image: {
    url: String,
    public_id: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema);