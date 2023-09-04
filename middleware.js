const { campgroundSchema, reviewSchema } = require('./schemas.js'); //we are destructuring because we will evemtually have multiple schemas
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ.USER...', req.user); //req.user is filled in by passport with the serialized user info
    if (!req.isAuthenticated()) {
        //store the url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body, { abortEarly: false });  //i dont really understand whats going on from here
    if (error) {
        const messages = error.details.map(el => el.message);
        const result = messages.join(',')
        throw new ExpressError(result, 400)
    }
    else {
        next(); //WE ABSOLUTELY NEED THIS NEXT() HERE OR ELSE THE CODE WILL STOP HERE 
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; //params are from the url, body is from the form
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //this is mongo syntax, it will pull the reviewId from the reviews array
    const review = await Review.findById(reviewId);
    if (!review.reviewAuthor.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });  //i dont really understand whats going on from here
    if (error) {
        const messages = error.details.map(el => el.message);
        const result = messages.join(',')
        throw new ExpressError(result, 400)
    }
    else {
        next(); //WE ABSOLUTELY NEED THIS NEXT() HERE OR ELSE THE CODE WILL STOP HERE 
    }
}
