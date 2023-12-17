const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        username: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
);

const UserPost = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        post: {
            trim: true,
            type: String,
            required: [true, 'The post must have a description'],
            maxlength: [2000, 'The post must not exceed 2000 characters']
        },
        photo: {
            required: true,
            type: String
        },
        publicId: {
            required: true,
            type: String
        },
        likes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }],
        ratings: {
            type: Number,
            default: 0
        },
        reviews: [reviewSchema],
        totalReviews: {
            type: Number,
            default: 0
        },
        totalViews: {
            type: Number,
            default: 0
        },
    }, { timestamps: true }
);

module.exports = mongoose.model('UserPost', UserPost);
