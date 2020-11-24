var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
Campground = require("./models/campground"),
seedDB = require("./seeds");

seedDB();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/", function(req, res)
{
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res)
{
    Campground.find({}, function(err, campgrounds)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("index", {campgrounds: campgrounds});    
       }
    });
});

app.post("/campgrounds", function(req, res)
{
    Campground.create(
    {
       name:req.body.name, 
       image: req.body.image,
       description: req.body.description
    }, function(err, campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) 
{
    res.render("new");    
});

app.get("/campgrounds/:id", function(req, res) 
{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("show", {foundCamp: foundCamp});    
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("The YelpCamp Server has been started!!"); 
});