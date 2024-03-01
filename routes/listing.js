const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Multer is a node.js middleware for handling multipart/form-data.
// To parse the form data we are using multer (Image)
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// controller routes callback are required here
const listingController = require("../controllers/listings.js");

// ROUTER.ROUTE is used when we have to send more than one request on same path.
// here on "/" there are two request (ie. GET and POST) 
// upload.single("listing[image]") -> here multer will bring the data in req.file (which contains info file like path, filename etc etc)
router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn, upload.single("listing[image]"), validateListing,  wrapAsync (listingController.createListing))


//new route
// FORMAL ROUTE ->
router.get("/new", isLoggedIn, listingController.renderNewForm);


//ROUTER.ROUTE is used when we have to send more than one request on same path.
// here on "/:id" there are 3 request (ie. GET, PUT and DELETE)
router.route("/:id").get( wrapAsync( listingController.showListing)).put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync( listingController.updateListing)).delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// index route
// FORMAL ROUTE ->
// router.get("/", wrapAsync(listingController.index));


//show route
// FORMAL ROUTE ->
// router.get("/:id", wrapAsync( listingController.showListing));

//create route
// FORMAL ROUTE ->
// router.post("/", isLoggedIn, validateListing, wrapAsync (listingController.createListing));

//edit route
// isLoggedIn checks that the user is logged in or not.
// isOwner will check that current.user.id is equal to lising.owner.id or not.
// FORMAL ROUTE ->
router.get("/:id/edit", 
isLoggedIn,
isOwner,
wrapAsync( listingController.renderEditForm));

//update route
// isLoggedIn checks that the user is logged in or not.
// isOwner will check that current.user.id is equal to lising.owner.id or not.
// FORMAL ROUTE ->
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing));


//Delete Route
// isLoggedIn checks that the user is logged in or not.
// isOwner will check that current.user.id is equal to lising.owner.id or not.
// FORMAL ROUTE ->
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;