var express = require("express"),
router      = express.Router({mergeParams: true}),
User        = require("../models/user"),
passport    = require("passport");

//Landing Page
router.get("/", function(req, res)
{
   res.render("landing"); 
});

//SignUp Form
router.get("/signup", function(req, res) 
{
    res.render("signup");    
});

//SignUp
router.post("/signup", function(req, res) 
{
    var userName = new User({username: req.body.username});
    var userPassword = req.body.password;
    User.register(userName, userPassword, function(err, user)
    {
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("back");
        }
        passport.authenticate("local")(req, res, function()
        {
            req.flash("success", "Congratulations, Welcome to YelpCamp, " + user.username + "!!");
            res.redirect("/campgrounds");    
        });
    });
});

//Login Form
router.get("/login", function(req, res) 
{
    res.render("login");    
});

//Login
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) 
{
    
});

//Logout
router.get("/logout", function(req, res) 
{
    req.logout();
    req.flash("success", "Logged you out!!");
    res.redirect("/campgrounds");
});

module.exports = router;