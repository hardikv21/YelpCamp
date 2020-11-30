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
            console.send(err);
        }
        passport.authenticate("local")(req, res, function()
        {
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
    res.redirect("/campgrounds");
});

module.exports = router;