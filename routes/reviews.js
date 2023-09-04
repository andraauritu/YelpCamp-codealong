const express = require('express');
const router = express.Router({ mergeParams: true }); //this is so that we can access the campground id from the url
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;


