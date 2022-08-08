const ExpressError = require('./utils/ExpressError');
const { benchSchema, reviewSchema, userSchema } = require('./schemas');
const Bench = require('./models/bench');
const Review = require('./models/review');

// Middleware that validates submitted benches
module.exports.validateBench = (req, res, next) => {
    // Server-side validation with joi for requests that create and update benches in db
    const { error } = benchSchema.validate(req.body);
    if (error) {
        // Format error message
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Middleware that validates submitted reviews
module.exports.validateReview = (req, res, next) => {
    // Server-side validation with joi for requests that create reviews in db
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // Format error message
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Middleware that validates registered user
module.exports.validateUser = (req, res, next) => {
    // Server-side validation with joi for requests that create reviews in db
    const { error } = userSchema.validate(req.body);
    if (error) {
        // Format error message
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Middleware that makes sure user is authenticated
module.exports.loginRequired = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save in session the page that the user is redirected from
        req.session.next = req.originalUrl;
        // Flash and redirect to login page
        req.flash('danger', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

// Middleware that makes sure user is authorized to edit/delete bench
module.exports.isBenchAuthor = async (req, res, next) => {
    // Retrieve id from url and query for bench
    const { id } = req.params;
    const bench = await Bench.findById(id);
    // If bench author is not the current authenticated user, flash and redirect
    if (!bench.author.equals(req.user._id)) {
        req.flash('danger', 'You do not have permission to do that.')
        return res.redirect(`/benches/${id}`);
    }
    next();
};

// Middleware that makes sure user is authorized to delete review
module.exports.isReviewAuthor = async (req, res, next) => {
    // Retrieve bench and review id from url
    const { id, reviewId } = req.params;
    // Query for review
    const review = await Review.findById(reviewId);
    // If review author is not the current authenticated user, flash and redirect
    if (!review.author.equals(req.user._id)) {
        req.flash('danger', 'You do not have permission to do that.')
        return res.redirect(`/benches/${id}`);
    }
    next();
};