var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//register page
router.get("/register", function(req, res){
  res.render("auth/register");
})
//register logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      req.flash("error", err);
      res.render("auth/register");
    } else {
        passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to Yardage "+ user.username);
        res.redirect("/fabrics");
      })
    }
  });
})
//login page
router.get("/login", function(req, res){
  res.render("auth/login");
})
//login logic
router.post("/login", passport.authenticate("local",
  {successRedirect:"/fabrics",
  failureRedirect:"/login"}),
  function(req, res){
})
//logout
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/fabrics");
})

module.exports = router;
