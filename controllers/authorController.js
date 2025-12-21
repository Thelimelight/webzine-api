const Author = require('../models/Author');

exports.createAuthor = async (req, res) => {
    if(!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, msg: 'Author data is required' });
    }
    
    try {
        const { name, institution } = req.body;

        if(!name) {
            return res.status(400).json({ success: false, msg: 'Author name is required' });
        }

        let imageData = {};
        if(req.file) {
          imageData = {
            url: req.file.path,
            public_id: req.file.filename
          }
        };

        console.log('FILE:', req.file);
        console.log('BODY:', req.body);
        

        
        const newAuthor = new Author({
            name, 
            institution: institution || '',
            image: imageData,
        })
        const savedAuthor = await newAuthor.save();
        res.status(201).json({ success: true, data: savedAuthor });
    }
    catch (error) {
        console.error('Error while creating author', error);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json({ success: true, count: authors.length, data: authors });
  }
  catch (error) {
    console.error('Error while getting authors', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if(!author) {
        return res.status(404).json({ success: false, msg: 'Author not found' });
    }
    res.status(200).json({ success: true, data: author });
  }
  catch (error) {
    console.error('Error while getting author', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.updateAuthor = async (req, res) => {
  const { name, institution } = req.body;
  try {
    const author = await Author.findById(req.params.id);
    if(!author) {
        return res.status(404).json({ success: false, msg: 'Author not found' });
    }
    author.name = name || author.name;
    author.institution = institution || author.institution;
    const updatedAuthor = await author.save();
    res.status(200).json({ success: true, data: updatedAuthor });
  }
  catch(error) {
    console.error('Error while updating author', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if(!author) {
        return res.status(404).json({ success: false, msg: 'Author not found' });
    }
    await author.deleteOne();
    res.status(200).json({ success: true, msg: 'Author deleted successfully' });
  }
  catch (error) {
    console.error('Error while deleting author', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};