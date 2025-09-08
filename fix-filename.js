const fs = require('fs');
const path = require('path');

const dir = './uploads';

fs.readdirSync(dir).forEach(file => {
  const ext = path.extname(file);
  const base = path.basename(file, ext);

  // Remove duplicate extension if present
  if (base.endsWith(ext)) {
    const newBase = base.slice(0, -ext.length);
    const newName = `${newBase}${ext}`;
    fs.renameSync(path.join(dir, file), path.join(dir, newName));
    console.log(`Renamed: ${file} → ${newName}`);
  }
});