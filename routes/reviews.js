const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schema.js');








app.post('/', isLoggedIn ,validateReview, catchAsync(reviews.createReview));

app.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;   
    