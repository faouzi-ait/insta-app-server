const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2048 * 2048
    }
    // fileFilter
});

module.exports = upload;
