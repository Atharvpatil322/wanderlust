const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// controller routes callback are required here
const userController = require("../controllers/users.js");

// ROUTER.ROUTE is used when we have to send more than one request on same path.
// here on "/signup" we are sending 2 req (ie. GET and POST)
router.route("/signup").get( userController.renderSignupForm).post( wrapAsync(userController.signup));

// here on "/login" we are sending 2 req (ie. GET and POST)
router.route("/login").get( userController.renderLoginForm).post( saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login);

// signup route
// FORMAL ROUTE ->
// router.get("/signup", userController.renderSignupForm);

// signup route
// FORMAL ROUTE ->
// router.post("/signup", wrapAsync(userController.signup));

// login route
// FORMAL ROUTE ->
// router.get("/login", userController.renderLoginForm);

// failureRedirect redirect us again to the login page if the credentials you entered are wrong.
// FailureFlash in Passport.js allows you to set a flash message when authentication fails.
// FORMAL ROUTE ->
// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login);

// logout route
router.get("/logout", userController.logout);

module.exports = router;