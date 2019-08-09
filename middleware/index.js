var Fabric = require("../models/fabric");
//all middleware
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first");
  res.redirect("/login");
};
middlewareObj.checkOwner = function(req, res, next){
  if(req.isAuthenticated()){
    Fabric.findById(req.params.id, function(err, fabric){
      if (err) {
        req.flash("error", "Fabric not found");
        res.redirect("back");
      } else {
        //does user own the fabric?
        if(fabric.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    })
  } else {
    req.flash("error", "Please login first");
    res.redirect("/login");
  }
};

module.exports = middlewareObj;
