require('dotenv').config()
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var User = require("./models/user");
var Fabric = require("./models/fabric");
var Project = require("./models/project");
mongoose.connect("mongodb://localhost:27017/fabrics", {useNewUrlParser: true});

var authRoutes = require("./routes/auth");
var fabricRoutes = require("./routes/fabrics");
var projectRoutes = require("./routes/projects");

var app = express();
var port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
  secret: "This is a practice site",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  next(err)
})
//userauth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
mongoose.set('useFindAndModify', false);
app.use(authRoutes);
app.use("/fabrics", fabricRoutes);
app.use("/projects", projectRoutes);

app.get("/", function(req, res){
  res.render("landing");
});


app.listen(port, ()=>{
    console.log("Server has started");
});
