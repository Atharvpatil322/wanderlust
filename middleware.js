// isLoggedIn
// saveRedirectUrl
// isOwner
// validateListing
// validateReview are the middlewares here



const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError =require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // console.log(req.path, req.orignalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must login!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// to check whether the current user is the actual owner of our listing or not, to make edit or update
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // here it checks that, Is the current user id equals to our listings owner id?...If not then flash the error message.
    // and if the current.user.id is equal to lising.owner.id then update the list.
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg );
    }else{
      next();
    }
  };

  

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg );
    }else{
      next();

    }
  };

  module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    // here it checks that, Is the current user id equals to our review owner...If not then flash the error message.
    // and if the current.user.id is equal to review author then update the list (ie deleting it).
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
};
