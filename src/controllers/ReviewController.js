// const Products = require('../model/Products');
const UserPost = require('../models/UserPost');

exports.getReviews = async (req, res, next) => {
    const listing = await UserPost.find();

    const reviewList = listing
        .filter(r => r.reviews.length > 0)
        .map(i => {
            return {
                postID: i._id,
                reviews: i.reviews
            };
        });

    return res.status(200).json({ success: true, reviewList });
};

exports.getPostReviews = async (req, res, next) => {
    const listing = await UserPost.find();

    const reviewList = listing
        .filter(r => r.reviews.length > 0)
        .map(i => {
            return {
                postID: i._id,
                reviews: i.reviews
            };
        });

    return res.status(200).json({ success: true, reviewList });
};

exports.createProductReview = async (req, res, next) => {
    const { postID, rating, comment } = req.body;

    try {
        const post = await UserPost.findById(postID);
        
        const newReview = {
            user: req.user._id,
            username: req.user.username,
            rating: Number(rating),
            comment
        };

        const isReviewed = post.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );
        
        if (isReviewed) {
            post.reviews.forEach(r => { // This overwrites the previous review
                if (r.user.toString() === req.user._id.toString()) {
                    r.comment = comment;
                    r.rating = rating;
                }
            });
        } else {
            post.reviews.push(newReview);
        }
    
        post.totalReviews = post.reviews.length;
        post.ratings = post.reviews.reduce((acc, item) => item.rating + acc, 0) / post.reviews.length;
            
        await post.save({ validateBeforeSave: false });
    
        return res.status(200).json({ success: true, message: 'Thank you for your review', post });
    } catch (error) {
        return res.status(500).json({ success: true, message: 'There was an error' + error });
    }
};
