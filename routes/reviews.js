const express = require('express');
// Preserve the bench id value in req.params
const router = express.Router({ mergeParams: true });

const reviews = require('../controllers/reviews');
const { loginRequired, isReviewAuthor, validateReview } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.post('/', loginRequired, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', loginRequired, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;