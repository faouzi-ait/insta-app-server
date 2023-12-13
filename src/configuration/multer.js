const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const maxSize = 10 * 1024 * 1024; // 10MB

const upload = multer({
    storage,
    limits: {
        fileSize: maxSize
    }
    // fileFilter
});

module.exports = upload;
