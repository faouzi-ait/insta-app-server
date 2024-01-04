const express = require('express');
const postController = require('../controllers/postController');
const reviewController = require('../controllers/ReviewController');
const upload = require('../configuration/multer');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/new-post', authMiddleware, upload.single('image'), postController.createPost);
router.get('/listing-posts', postController.listAllPosts);
router.get('/q?', postController.searchPosts);
router.get('/post-data/:id', postController.getPostInfos);
router.get('/single-post/:id', postController.findSinglePost);
router.post('/viewed-post/:id', postController.updatePostView);
router.post('/like-post/:id', authMiddleware, postController.likePost);
router.post('/favorite-post/:id', authMiddleware, postController.favoritesPost);
router.delete('/delete-posts/:id', authMiddleware, postController.deleteSinglePost);

router.get('/reviews', reviewController.getReviews);
router.put('/reviews', authMiddleware, reviewController.createProductReview);

module.exports = router;
