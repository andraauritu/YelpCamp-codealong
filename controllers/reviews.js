const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params; //params are from the url, body is from the form
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review); //we can access this because we did review[body] and review[rating] in the form
    review.reviewAuthor = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; //params are from the url, body is from the form
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`)
}