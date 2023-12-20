const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../configuration/multer');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-contacts', userController.getAllContacts);
router.get('/get-user-contacts', authMiddleware, userController.getUserContacts);
router.post('/create-contact', authMiddleware, upload.single('image'), userController.createContact);

module.exports = router;
