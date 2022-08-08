const Bench = require('../models/bench');
const Review = require('../models/review');

// Controller that handles creation of new reviews
module.exports.createReview = async (req, res) => {
    // Retrieve id from url and query for bench
    const { id } = req.params;
    const bench = await Bench.findById(id);
    // Create new review with form data
    const review = new Review(req.body.review);
    // Set author of review to current authenticated user
    review.author = req.user._id;
    // Push review to list of bench reviews

    review.bench = bench;

    bench.reviews.push(review);

    await review.save();
    await bench.save();
    // Flash and redirect to page of reviewed bench
    req.flash('success', 'Successfully added a new review');
    res.redirect(`/benches/${bench._id}`);
};

// Controller that handles deletion of reviews
module.exports.deleteReview = async (req, res) => {
    // Retrieve bench id and review id from url
    const { id, reviewId } = req.params;
    // Remove review from list of bench reviews
    await Bench.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete review
    await Review.findByIdAndDelete(reviewId);
    // Flash and redirect to page of reviewed bench
    req.flash('success', 'Successfully deleted your review');
    res.redirect(`/benches/${id}`);
};