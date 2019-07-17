var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var Fabric = require("./models/fabric");
mongoose.connect("mongodb://localhost:27017/fabrics", {useNewUrlParser: true});

var app = express();
var port = 3000;


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

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


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/fabrics", function(req, res){
  Fabric.find({}, function(err, allFabrics){
    if(err) {
      console.log(err);
    } else {
      res.render("fabrics/index", {fabrics: allFabrics});
    }
  })

})

app.post("/fabrics", function(req, res){
  //get data from form, add to fabrics db
  var newFabric = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  }
  Fabric.create(newFabric, function(err, fabric){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/fabrics");
      //redirect back to fabrics
    }
  })
})

app.get("/fabrics/new", function(req, res){
  res.render("fabrics/new");
})

app.listen(port, ()=>{
    console.log("Server has started");
});

app.get("/fabrics/:id", function(req, res){
  Fabric.findById(req.params.id, function(err, fabric){
    if (err) {
      console.log(err);
    } else {
      res.render("fabrics/show", {fabric: fabric});
    }
  })
});

//auth routes
app.get("/register", function(req, res){
  res.render("auth/register");
})

app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      return res.render("auth/register");
    } passport.authenticate("local")(req, res, function(){
        res.redirect("/fabrics");
      })
  });
})
