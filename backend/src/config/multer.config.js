const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFolder = path.join(__dirname, 'uploads');

// Check if uploads folder exists, if not, create it
if (!fs.existsSync(uploadFolder)) {  //fs.existsSync -> checks if the file with specific destination is present or not. 
  fs.mkdirSync(uploadFolder, { recursive: true }); 
}

const storage = multer.diskStorage({
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
    destination: (req, file, cb) => {
      cb(null, uploadFolder); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // path.extname -> return the extention of particular file
    },
});

const upload = multer({ storage: storage });

module.exports = upload;