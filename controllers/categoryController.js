const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    if(!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, msg: 'Category data is required' });
    }


    try {
    const { name, parent } = req.body;
    if(!name || !name.trim()) {
      return res.status(400).json({ success: false, msg: 'Category name is required' });
    }

    if(parent) {
      const parentCategory = await Category.findById(parent);
      if(!parentCategory) {
        return res.status(400).json({ success: false, msg: 'Invalid parent category' });
      }
    }

    const category = await Category.create({
      name: name.trim(),
      parent: parent || null,
    });

    res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        console.error('Error while creating category', error);
        if (error.code === 11000) {
             return res.status(400).json({ message: 'A category with this name already exists', error: error });
        }
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, count: categories.length, data: categories });
  }
  catch (error) {
    console.error('Error while getting categories', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.getCategoriesAsTree = async (req, res) => {
  try {
        const categories = await Category.find().lean();

    const map = {};
    categories.forEach(cat => {
      map[cat._id] = { ...cat, children: [] };
    });

    const tree = [];
    categories.forEach(cat => {
      if (cat.parent && map[cat.parent]) {
       map[cat.parent].children.push(map[cat._id]);
      } else {
        tree.push(map[cat._id]);
      }
    })

    res.status(200).json({ success: true, data: tree });

  }
  catch (error) {
    console.error('Error while getting categories as tree', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
}

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if(!category) {
        return res.status(404).json({ success: false, msg: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  }
  catch (error) {
    console.error('Error while getting category', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if(!category) {
        return res.status(404).json({ success: false, msg: 'Category not found' });
    }
    category.name = req.body.name || category.name;
    const updatedCategory = await category.save();
    res.status(200).json({ success: true, data: updatedCategory });
  }
  catch (error) {
    console.error('Error while updating category', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if(!category) {
        return res.status(404).json({ success: false, msg: 'Category not found' });
    }
    await category.deleteOne();
    res.status(200).json({ success: true, msg: 'Category deleted successfully' });
  }
  catch (error) {
    console.error('Error while deleting category', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};