// isLoggedIn
// saveRedirectUrl
// isOwner
// validateListing
// validateReview are the middlewares here



const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError =require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


// isAuthenticated() method checks whether the user is logged in or out
// for that we've created a callback which redirects us to the login page
// if the user is not authenticated tha is not logged in

// req.path is the path we are trying to access, but failed to access as we weren't logged in (ex : path such as "/new").
// req.originalUrl is a complete path (ex : complete path such as "/listings/new").
// here in redirectUrl we have stored our originalUrl (ie complete path).


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // console.log(req.path, req.orignalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must login!");
        return res.redirect("/login");
    }
    next();
        // it is a middleware so we have to call our next middleware.
};

// now we stored req.session.redirectUrl in res.locals as locals are the variable which are accessible everywhere and even passport cant delete these locals variable
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
        // it is a middleware so we have to call our next middleware.
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
    // it is a middleware so we have to call our next middleware.
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg );
    }else{
      next();
    // it is a middleware so we have to call our next middleware.
    }
  };

  

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg );
    }else{
      next();
    // it is a middleware so we have to call our next middleware.
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
    // it is a middleware so we have to call our next middleware.
};