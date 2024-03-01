// This is the controller from MVC approach where we create core functionality for our backend routes,
// and then exporting to the routes/listing.js

const Listing = require("../models/listing");

// mapb0x-sdk installed from github, from which we are requiring forward geocoding[text to coordinates]
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


// index route
// module.exports.index = async(req,res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings});
// };

// index route
module.exports.index = async(req,res) => {
  // Extract the 'q' query parameter from the request URL
  let query = req.query.q;
  // Define a variable to store the listings
  let allListings;

  // Check if there is a 'q' query parameter present in the request URL
  if (query) {
     // If 'q' query parameter is present, perform a text search query using MongoDB's $text operator
        // Find all listings where the specified search query matches any indexed fields
      allListings = await Listing.find({ $text: { $search: query } });
  } else {
    // If 'q' query parameter is not present, retrieve all listings without filtering
      allListings = await Listing.find({});
  }
  // Render the 'listings/index.ejs' view template and pass the retrieved listings and search query to it
  res.render("listings/index.ejs", {allListings, query});
};


// new route
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

// show route
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    // .populate("reviews", "users") -> As we stored reviewId in ListingSchema and we neeed their data. so we'll use this method
    // here we are using nested populate (using path) for reviews to access the author, as we need the author's id info. As in reviewSchema we're storing just the author's Id and not its info so inorder to access the info we use .populate.
    // for every individual we need author in our path.
    // this means for every review we populate its (that specific review's) author.
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    };
    res.render("listings/show.ejs", {listing});
};

// create route
module.exports.createListing = async (req, res, next) => {
  
  // geocodingClient is the one who performs both forward and backward geocoding.
  // here we are using forward geocoding while creating a new listing
  let response = await geocodingClient.forwardGeocode({
    query : req.body.listing.location,
    limit : 1,
  }).send();


  // we accessed url and filename from req.file 
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    // here the new listing that is created...we are storing our current owner id in it from req.user.
    newListing.owner =  req.user._id;
    // now when we create a newListing, here we add url and filename (that we extracted)in our newListing.image
    newListing.image = {url,  filename};

    // here response.body contains the coordinates of the place which we are storing in our newlisitng.
    // (response.body.featuress[0].geometry) its the path to get those coordinates.
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};

// edit form
module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    };
    res.render("listings/edit.ejs", {listing});
};

// update route
module.exports.updateListing =  async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // The typeof operator in JavaScript is used to find the type of a variable, function, or object.
    // if req.file is not undefined then execute the code (ie. extract the url, filename from req.file and save the new listing).
    // This logic is used if by any chance the "update image" is empty.
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      // now when we updated our listing, here we add url and filename (that we extracted)in our listing.image
      listing.image = { url, filename};
      await listing.save();
    };

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

// delete route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };