const User = require("../models/user");

// signup route
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// signup route
// here the logic of using req.login is, once the user signup then it automatically gets loggedin.
// no need to fill the details again to login.
// req.login automatically establishes a login session.
module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
};

// login route
module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
};

// login route
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // if res.locals.redirectedUrl exists then store it in  redirectUrl that we created OR ELSE store "/listings" in redirectUrl
    // now if the user tries to login directly without going to any path (like "Add new listing" or "edit") they we will get redirected to the "/listings"
    // suppose if they click on "Add new listing" their path will get stored in locals variable which we defined in "middleware.js" and it will store it here in redirectUrl and then redirect us to user's desired path (ie "Add new listing")
    res.redirect(redirectUrl);
};


// logout route
module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};

