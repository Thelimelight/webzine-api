const Category = require('../models/categoryModel');

exports.create = async (req, res) => {
    try {
        const { name, parent } = req.body;

        const category = new Category({
            name, 
            parent: parent || null,
        })
        await category.save();
        res.status(201).json({
            message: 'Category created successfully',
            category: {
                id: category._id,
                name: category.name,
                parent: category.parent
            }
        })
    }
    catch(err) {
        console.error('Error while create category: ',err);
        res.status(500).json({message: 'Server error'});
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        
        await category.deleteOne();
        res.status(200).json({message: 'Category deleted successfully'});
        
    }
    catch (err) {
        console.error('Error while deleting category: ', err);
        res.status(500).json({message: 'Server error'});
    }
}

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

