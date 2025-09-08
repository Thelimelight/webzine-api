const multer = require('multer');
const path = require('path');

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // e.g., '.png'
    const baseName = path.basename(file.originalname, ext); // e.g., 'Screenshot 2025-08-10 022926'

    // Sanitize base name: replace spaces and remove special characters
    const safeBaseName = baseName.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');

    // Final filename: timestamp + sanitized name + extension
    const uniqueSuffix = `${Date.now()}-${safeBaseName}${ext}`;
    cb(null, uniqueSuffix);
  }
});

// Create the multer instance
const upload = multer({ storage });

module.exports = upload;