const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  slug: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  }
}, { timestamps: true });

CategorySchema.index(
  { slug: 1, parent: 1 },
  { unique: true }
);

CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();

  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  next();
}); 

module.exports = mongoose.model('Category', CategorySchema);