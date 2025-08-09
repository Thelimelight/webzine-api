const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function ( req, file, cb ) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + file.originalname + ext;
        cb (null, uniqueSuffix);
    } 
})

const upload = multer({
    storage: storage,
})

module.exports = upload;