var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var Fabric = require("./models/fabric");
mongoose.connect("mongodb://localhost:27017/fabrics", {useNewUrlParser: true});

var authRoutes = require("./routes/auth");
var fabricRoutes = require("./routes/fabrics");

var app = express();
var port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
  secret: "This is a practice site",
  resave: false,
  saveUninitialized: false
}));

//userauth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use(authRoutes);
app.use("/fabrics", fabricRoutes);

app.get("/", function(req, res){
  res.render("landing");
});


//login middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } res.redirect("/login");
}
app.listen(port, ()=>{
    console.log("Server has started");
});
