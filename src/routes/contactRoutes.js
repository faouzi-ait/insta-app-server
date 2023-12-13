const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../configuration/multer');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-contact', authMiddleware, upload.single('image'), userController.createContact);
router.get('/get-user-contacts', authMiddleware, userController.getUserContacts);
router.get('/get-contacts', userController.getAllContacts);

module.exports = router;
