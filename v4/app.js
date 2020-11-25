var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
Campground = require("./models/campground"),
Comment = require("./models/comment"),
seedDB = require("./seeds");

seedDB();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static(__dirname + "/public"));

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
           res.send(err);
       }
       else
       {
           res.render("campgrounds/index", {campgrounds: campgrounds});    
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
            res.send(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) 
{
    res.render("campgrounds/new");    
});

app.get("/campgrounds/:id", function(req, res) 
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

app.get("/campgrounds/:id/comment/new", function(req, res)
{
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            res.send(err);    
        }
        else
        {
            res.render("comments/new", {campground: campground});    
        }
    });    
});

app.post("/campgrounds/:id/comment", function(req, res)
{
    Campground.findById(req.params.id, function(err, campground) 
    {
        if(err)
        {
            res.send(err);
        }
        else
        {
            Comment.create(req.body.comment, function(err, comment)
            {
                if(err)
                {
                    res.send(err);    
                }
                else
                {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });    
});

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("The YelpCamp Server has been started!!"); 
});