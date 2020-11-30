var express = require("express"),
router      = express.Router({mergeParams: true}),
Campground  = require("../models/campground");

//Show all Campgrounds
router.get("/", function(req, res)
{
    Campground.find({}, function(err, campgrounds)
    {
       if(err)
       {
           res.send(err);
       }
       else
       {
           res.render("campgrounds/index", {campgrounds: campgrounds});    
       }
    });
});

//Campground Form
router.get("/new", isLoggedIn, function(req, res) 
{
    res.render("campgrounds/new");    
});

//Create Campground
router.post("/", isLoggedIn, function(req, res)
{
    Campground.create(
    {
       name: req.body.name, 
       image: req.body.image,
       description: req.body.description,
       author: {
            id: req.user._id,
            username: req.user.username
       }
    }, function(err, campground)
    {
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

//Show Campground(:id)
router.get("/:id", function(req, res) 
{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp)
    {
       if(err)
       {
           res.send(err);
       }
       else
       {
           res.render("campgrounds/show", {foundCamp: foundCamp});    
       }
    });
});

//MiddleWare
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;