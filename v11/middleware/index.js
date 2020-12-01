var middleware = {},
Campground     = require("../models/campground"),
Comment        = require("../models/comment");

middleware.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash("error", "Please Login First!!");
        res.redirect("/login");
    }
};

middleware.checkOwnerCampground = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCamp)
        {
            if(err || !foundCamp)
            {
                req.flash("error", "Sorry, Campground not found!!");
                res.redirect("back");
            }
            else
            {
                if(foundCamp.author.id.equals(req.user._id))
                {
                    return next();    
                }
                else
                {
                    req.flash("error", "Sorry, You are not authorized to do that!!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "Please Login First!!");
        res.redirect("/login");
    }
};

//Check Ownership MiddleWare
middleware.checkOwnerComment = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.commentId, function(err, comment)
        {
            if(err || !comment)
            {
                req.flash("error", "Sorry, Comment not found");
                res.redirect("back");
            }
            else
            {
                if(comment.author.id.equals(req.user._id))
                {
                    return next();    
                }
                else
                {
                    req.flash("error", "Sorry, You are not authorized to do that!!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "Please Login First!!");
        res.redirect("/login");
    }
};

module.exports = middleware;