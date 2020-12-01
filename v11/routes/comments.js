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
            req.flash("error", "Sorry, Comment not found!!");
            res.redirect("back");    
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
            req.flash("error", "Sorry, Comment not found!!");
            res.redirect("back");
        }
        else
        {
            //req.body.comment = req.sanitize(req.body.comment);
            Comment.create(req.body.comment, function(err, comment)
            {
                if(err)
                {
                    req.flash("error", err.message);
                    res.redirect("back");    
                }
                else
                {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Congratulations, You successfully added a comment!!");
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
        if(err)
        {
            req.flash("error", "Sorry, Comment not found!!");
            res.redirect("back");
        }
        res.render("comments/edit", {campgroundId: req.params.id, comment: comment});    
    });
});

//Update Comment
router.put("/:commentId/", middleware.checkOwnerComment, function(req, res)
{
    Campground.findById(req.params.id, function(err, campground) 
    {
        if(err || !campground)
        {
            req.flash("error", "Sorry, Campground not found!!");
            res.redirect("back");    
        }
        else
        {
            req.body.comment.text = req.sanitize(req.body.comment.text);
            Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment)
            {
                if(err)
                {
                    req.flash("error", "Sorry, Comment not found!!");
                    res.redirect("back");
                }
                else
                {
                    req.flash("success", "Congratulations, You successfully updated a comment!!");
                    res.redirect("/campgrounds/" + req.params.id);    
                }
            });    
        }
    });
});

//Delete Comment
router.delete("/:commentId", middleware.checkOwnerComment, function(req, res)
{
    Comment.findByIdAndRemove(req.params.commentId, function(err)
    {
        if(err)
        {
            req.flash("error", "Comment");
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Congratulations, You successfully deleted a comment!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });    
});

module.exports = router;