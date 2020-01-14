const User = require("../models/user");

const register = function(req, res){
    res.render("auth/register");
  }
const addUser = function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if(err) {
        req.flash("error", err.message);
        return res.redirect("/register");
      } else {
          passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Yardage "+ user.username);
          res.redirect("/fabrics");
        })
      }
    });
  }
const login = function(req, res){
    res.render("auth/login");
}  
const logout = function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/fabrics");
  }
module.exports = {
    register,
    addUser,
    login,
    logout
}