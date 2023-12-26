const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../configuration/multer');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/album', authMiddleware, upload.array('image'), userController.albumUpload);
router.post('/register', upload.single('image'), userController.registerUser);
router.put('/update-photo', authMiddleware, upload.single('image'), userController.updateUserPhoto);
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshToken);
router.get('/users', userController.getAllUsers);
router.get('/user-photo/:id', userController.getUserPicture);
router.put('/reset-password', userController.resetPassword);
router.delete('/user-delete/:id', authMiddleware, userController.deleteUser);

router.post('/user-likes/:id', authMiddleware, userController.userFavoritePost);
router.get('/user-favorites', authMiddleware, userController.getUserFavorites);
router.get('/user-contacts', authMiddleware, userController.getUserFavorites);

module.exports = router;
