const mongoose = require('mongoose');

const { Schema } = mongoose; //or const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    reviewAuthor: {
        type: Schema.Types.ObjectId,
        ref: 'User' //this is the user that created the review
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

