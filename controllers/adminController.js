const path = require('path')
const postModel = require('../models/postModel')

exports.adminDetails = async (req, res) => {
    try {
        res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                profileImage: path.basename(req.user.profileImage),
            }
        })
    }
    catch(err) {
        console.error(`Error while get admin detail ${err}`)
        res.status(500).json({message: "Server error"})
    }
}

exports.posts = async (req, res) => {
    try {
        const posts = await postModel.find()
            .populate('category')
            .populate({ path: 'category.parent', select: 'name' })
        res.status(200).json(posts);
    }
    catch(err) {
        console.error("Error while get posts: ", err);
        res.status(500).json({message: "Server error"})
    }
}