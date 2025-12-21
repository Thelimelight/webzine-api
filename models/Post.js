const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'Author',
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: {
    url: String,
    public_id: String,
  }
}, { timestamps: true });

PostSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    next();
  }
  this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  this.slug = `${this.slug}-${Date.now().toString(36).slice(-4)}`;
  next();
});

module.exports = mongoose.model('Post', PostSchema);