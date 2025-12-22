const Post = require('../models/Post');
const Category = require('../models/Category');
const Author = require('../models/Author');
const { post } = require('../routes/postRoutes');

exports.createPost = async (req, res) => {
  try {
    const { title, content, authorId, categoryId, status } = req.body;

    let imageData = {};
    if (req.file) {
      imageData = {
        url: req.file.secure_url,       
        public_id: req.file.public_id 
      };
    }

    const newPost = new Post({
      title,
      content,
      author: authorId,
      category: categoryId,
      status: status || 'draft',
      image: imageData, 
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, data: savedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author').populate('category');
    res.status(200).json({ success: true, data: posts });
  }
  catch (error) {
    console.error('Error while getting posts', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author').populate('category');
    if(!post) {
        return res.status(404).json({ success: false, msg: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  }
  catch (error) {
    console.error('Error while getting post', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { title, content, authorId, categoryId, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Update text fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (status) post.status = status;
    if (authorId) post.author = authorId;
    if (categoryId) post.category = categoryId;

    if (req.file) {
      if (post.image && post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      post.image = {
        url: req.file.secure_url,
        public_id: req.file.public_id
      };
    }

    const updatedPost = await post.save();
    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });

    // 3. Delete image from Cloudinary when deleting post
    if (post.image && post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();
    res.status(200).json({ success: true, msg: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.getPostsByAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({ path: 'author', select: 'name' })
      .populate({ path: 'category', select: 'name' })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  }
  catch (error) {
    console.error('Error while getting posts by admin', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};