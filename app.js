// dotenv is used to load env variables into process.env (current file).
// dotenv is only used in development phase and not in production phase, that's the reason we've used a if logic.
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// routes connection using router
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => { 
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// backend doesn't understand what type of data the form is sending, that's the reason we use parser.
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// session options
const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};

// index route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

// using session and flash
app.use(session(sessionOptions));
app.use(flash());

// using passport and then with session,
// so that user dont have to login again and again
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// serializer helps to store the object (that contains req.user info such as email, username, pass if youre creating a signup form)
// deserializer is opp. It is used to retrieve stored obejct
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connect-flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // currUser stores the info of current user from req.user.
  res.locals.currUser = req.user;
  next();
})

// connected the routes with common path and their route file variable,
// which we required from routes folder
  app.use("/listings", listingRouter);
  app.use("/listings/:id/reviews", reviewsRouter);
  app.use("/", userRouter);


  
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "my villa",
//         description : "home",
//         price : 1200,
//         locaion : "goa",
//         country : "india"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfully testing");
// });

// error handler, where all routes except our defined route will get handled
app.all("*", (req ,res , next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.send(statusCode).send(message);
});


  app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });