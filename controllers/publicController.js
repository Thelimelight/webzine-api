const Category = require('../models/categoryModel');
const Post = require('../models/postModel')

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent', 'name');
        res.status(200).json({
            message: 'Categories fetched successfully',
            categories: categories.map(cat => ({
                id: cat._id,
                name: cat.name,
                parent: cat.parent ? { id: cat.parent._id, name: cat.parent.name } : null
            }))
        });
    }
    catch(err) {
        console.error('Error while fetching categories: ', err);
        res.status(500).json({message: 'Server error'});
    }
}

exports.getStructuredCategories = async (req, res) => {
    try {
        const mainCategories = await Category.find({ parent: null}).sort({ name: 1 });
        const buildTree = async (category) => {
            const children = await Category.find({ parent: category._id }).sort({ name: 1 })
            return {
                id: category._id, 
                name: category.name,
                children: await Promise.all(children.map(buildTree))
            }
        }

        const structured = await Promise.all(mainCategories.map(buildTree));
        res.status(200).json({
            message: 'Structured categories fetched successfully',
            categories: structured
        })
    }
    catch(err) {
        console.error('Error while fetching structured categories: ', err);
        res.status(500).json({message: 'Server error'});
    }
}

exports.getFilteredPosts = async (req, res) => {
    try {
        const {category} = req.query;
        let filter = {};

        if(category) {
            filter.category = category;
        }
        const posts = await Post.find(filter).populate("category");
        res.status(200).json(posts)
    }
    catch(err) {
        console.error('Error while fetching filtered posts: ', err);
        res.status(500).json({message: 'Server error'})
    }
}

exports.posts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('category')
            .populate({ path: 'category.parent', select: 'name' })
        res.status(200).json(posts);
    }
    catch(err) {
        console.error("Error while get posts: ", err);
        res.status(500).json({message: "Server error"})
    }
}

exports.postDetails = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
           .populate('category')
           .populate('category.parent', 'name')

        if(!post) {
            return res.status(404).json({message: "Post not found"})
        }
        res.json(post);
    }
    catch(err) {
        console.error('Error while get post details page: ', err);
        res.status(500).json({message: "Server error"});
    }
}

exports.latestPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('category')
            .populate({ path: 'category.parent', select: 'name'});
    }
    catch(err) {
        console.error('Error while fetching the latest posts: ', err);
        res.status(500).json({message: 'Server error'})
    }
}