var express = require("express");
var router = express.Router({mergeParams: true});
var Fabric = require("../models/fabric");

//show all fabrics
router.get("/", function(req, res){
  Fabric.find({}, function(err, allFabrics){
    if(err) {
      console.log(err);
    } else {
      res.render("fabrics/index", {fabrics: allFabrics});
    }
  })

})
//add new fabric - post route
router.post("/", isLoggedIn, function(req, res){
  //get data from form, add to fabrics db
  var newFabric = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: {id: req.user._id, username: req.user.username}
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
//new fabric entry page
router.get("/new", isLoggedIn, function(req, res){
  res.render("fabrics/new");
})
//fabric detail page
router.get("/:id", function(req, res){
  Fabric.findById(req.params.id, function(err, fabric){
    if (err) {
      console.log(err);
    } else {
      res.render("fabrics/show", {fabric: fabric});
    }
  })
});

//edit fabric routes
router.get("/:id/edit", function(req, res){
  Fabric.findById(req.params.id, function(err, fabric){
    if (err) {
      console.log(err);
    } else {
      res.render("fabrics/edit", {fabric: fabric});
    }
  })
})
//update fabric route
router.put("/:id", function(req, res){
  Fabric.findByIdAndUpdate(req.params.id, req.body.fabric, function(err, fabric){
    if (err) {
      res.redirect("/fabric");
    } else {
      res.redirect("/fabrics/"+req.params.id);
    }
  })
})

//destroy route
router.delete("/:id", function(req, res){
  Fabric.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/fabrics");
    } else res.redirect("/fabrics");
  })
})

//login middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } res.redirect("/login");
}

module.exports = router;
