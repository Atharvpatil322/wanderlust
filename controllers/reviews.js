const Listing = require("../models/listing");
const Review = require("../models/review");

// post route
module.exports.createReview = async (req, res) =>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // the new review created by the user that was logged in at the time of creating the review, Will be that review's author
    // their id will be extracted from the req.user.id and that id will become the id of author.
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
  };

// delete route
module.exports.destroyReview = async(req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};
