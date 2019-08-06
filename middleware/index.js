var Fabric = require("../models/fabric");
//all middleware
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } res.redirect("/login");
};
middlewareObj.checkOwner = function(req, res, next){
  if(req.isAuthenticated()){
    Fabric.findById(req.params.id, function(err, fabric){
      if (err) {
        res.redirect("back");
      } else {
        //does user own the fabric?
        if(fabric.author.id.equals(req.user._id)){
          next();
        } else {
          res.send("You do not have permission to do that");
        }
      }
    })
  } else {
    res.redirect("/login");
  }
};

module.exports = middlewareObj;
