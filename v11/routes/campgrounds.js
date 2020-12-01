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
            req.flash("error", err.message);
            res.redirect("back");
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
       name: req.sanitize(req.body.name), 
       image: req.sanitize(req.body.image),
       description: req.sanitize(req.body.description),
       price: req.sanitize(req.body.price),
       author: {
            id: req.user._id,
            username: req.user.username
        }    
    }, function(err, campground)
    {
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Congratulations, You successfully added a campground!!");
            res.redirect("/campgrounds");
        }
    });
});

//Show Campground(:id)
router.get("/:id", function(req, res) 
{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp)
    {
        if(err || !foundCamp)
        {
            req.flash("error", "Sorry, Campground not found!!");
            res.redirect("back");
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
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("back");
        }
        res.render("campgrounds/edit", {camp: foundCamp});
    });
});

//Update Campground
router.put("/:id", middleware.checkOwnerCampground, function(req, res)
{
    req.body.camp.name = req.sanitize(req.body.camp.name);
    req.body.camp.image = req.sanitize(req.body.camp.image);
    req.body.camp.description = req.sanitize(req.body.camp.description);
    req.body.camp.price = req.sanitize(req.body.camp.price);
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err)
    {
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Congratulations, You successfully updated a campground!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });    
});

//Delete Campground
router.delete("/:id", middleware.checkOwnerCampground, function(req, res)
{
    Campground.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            req.flash("error", "Campground");
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Congratulations, You successfully deleted a campground!!");
            res.redirect("/campgrounds");
        }
    });    
});

module.exports = router;