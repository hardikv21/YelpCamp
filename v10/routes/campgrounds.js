var express = require("express"),
router      = express.Router({mergeParams: true}),
Campground  = require("../models/campground"),
middleware  = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, function(req, res) 
{
    res.render("campgrounds/new");    
});

//Create Campground
router.post("/", middleware.isLoggedIn, function(req, res)
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

//Campground Update Form
router.get("/:id/edit", middleware.checkOwnerCampground, function(req, res) 
{
    Campground.findById(req.params.id, function(err, foundCamp)
    {
        res.render("campgrounds/edit", {camp: foundCamp});
    });
});

//Update Campground
router.put("/:id", middleware.checkOwnerCampground, function(req, res)
{
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err)
    {
        if(err)
        {
            res.send(err);
        }
        res.redirect("/campgrounds/" + req.params.id);
    });    
});

//Delete Campground
router.delete("/:id", middleware.checkOwnerCampground, function(req, res)
{
    Campground.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            res.send(err);
        }
        res.redirect("/campgrounds");
    });    
});

module.exports = router;