var express = require("express"),
router      = express.Router({mergeParams: true}),
Campground  = require("../models/campground"),
Comment     = require("../models/comment");

//Comment Form
router.get("/new", isLoggedIn, function(req, res)
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

//Create Comment
router.post("/", isLoggedIn, function(req, res)
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
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