const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../configuration/multer');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/album', authMiddleware, upload.array('image'), userController.albumUpload);
router.post('/register', upload.single('image'), userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshToken);
router.get('/users', userController.getAllUsers);
router.put('/reset-password', userController.resetPassword);
router.delete('/user-delete/:id', authMiddleware, userController.deleteUser);

module.exports = router;
