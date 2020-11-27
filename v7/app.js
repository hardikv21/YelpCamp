var express   = require("express"),
app           = express(),
bodyParser    = require("body-parser"),
mongoose      = require("mongoose"),
Campground    = require("./models/campground"),
Comment       = require("./models/comment"),
User          = require("./models/user"),
passport      = require("passport"),
passportLocal = require("passport-local");
//passportLocalMongoose = require("passport-local-mongoose");
//seedDB = require("./seeds")

//seedDB();

var campgroundRoute = require("./routes/campgrounds"),
commentRoute        = require("./routes/comments"),
indexRoute          = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static(__dirname + "/public"));

app.use(require("express-session")(
{
    secret: "YelpCamp is the first website of Hardik",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
{
    res.locals.currentUser = req.user;
    next();
});

app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comment", commentRoute);
app.use(indexRoute);

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("The YelpCamp Server has been started!!"); 
});