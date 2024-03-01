const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
  
const reviewController = require("../controllers/reviews.js");

const review = require("../models/review.js");

  // reviews 
  // post review route
  router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

  // delete review route
  // isLoggedIn -> checks whether the user is logged in or not
  // isReviewAuthor -> checks whether the user is the only one who created that review or not...if he/she is the one who created then only they can delete the review.
  router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

  module.exports = router;