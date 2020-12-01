var middleware = {},
Campground     = require("../models/campground"),
Comment        = require("../models/comment");

middleware.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
};

middleware.checkOwnerCampground = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCamp)
        {
            if(err)
            {
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
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
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
            if(err)
            {
                res.send(err);
            }
            else
            {
                if(comment.author.id.equals(req.user._id))
                {
                    return next();    
                }
                else
                {
                    res.send("Not Authorized");
                }
            }
        });
    }
    else
    {
        res.redirect("/login");    
    }
};

module.exports = middleware;