var express = require("express"),
router      = express.Router({mergeParams: true}),
Campground  = require("../models/campground"),
Comment     = require("../models/comment"),
middleware  = require("../middleware");

//Comment Form
router.get("/new", middleware.isLoggedIn, function(req, res)
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
router.post("/", middleware.isLoggedIn, function(req, res)
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

//Comment Update Form
router.get("/:commentId/edit", middleware.checkOwnerComment, function(req, res)
{
    Comment.findById(req.params.commentId, function(err, comment)
    {
        res.render("comments/edit", {campgroundId: req.params.id, comment: comment});    
    });
});

//Update Comment
router.put("/:commentId/", middleware.checkOwnerComment, function(req, res)
{
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment)
    {
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);    
        }
    });
});

//Delete Comment
router.delete("/:commentId/", middleware.checkOwnerComment, function(req, res)
{
    Comment.findByIdAndRemove(req.params.commentId, function(err)
    {
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });    
});

module.exports = router;