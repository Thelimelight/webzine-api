const postModel = require("../models/postModel");

exports.create = async (req, res) => {
  try {
    const { title, body, institution, author, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const image = req.file.filename;

    const newPost = new postModel({
      title,
      body,
      institution,
      author,
      image,
      category,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    console.error("Error while uploading post:", err);
    res.status(500).json({ message: "Server error" });
  } 
};

exports.getPostById = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id)
      .populate('category')
      .populate('category.parent', 'name');
    if(!post) {
      return res.status(404).json({message: "Post not found"});
    }
    res.json(post);
  }
  catch(err) {
    console.error("Error while get post id: ", err);
    res.status(500).json({message: "Server error"})
  }
}

exports.updatePost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if(!post) {
      return res.status(404).json({message: "Post not found"});
    }

    post.title = req.body.title || post.title;
    post.author = req.body.author || post.author;
    post.institution = req.body.institution || post.institution;
    post.body = req.body.body || post.body;

    if(req.file) {
      post.image = req.file.filename;
    }

    const updated = await post.save()
    res.json(updated)
  }
  catch(err) {
    console.error('Error updating post: ', err);
    res.status(500).json({message: "Server error"})
  }
}

exports.deletePost = async (req, res) => {
  try{
    const post = postModel.findById(req.params.id);
    if(!post) {
      return res.status(404).json({message: "Post not found"})
    }

    await post.deleteOne();
    res.json({message: "Post deleted"});
  }
  catch(err) { 
    console.error("Deleting post failed")
    res.status(500).json({message: "Server error"})
  }
}