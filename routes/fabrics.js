var express = require("express");
var router = express.Router({mergeParams: true});
var Fabric = require("../models/fabric");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("fabrics/new");
})
//fabric detail page
router.get("/:id", function(req, res){
  Fabric.findById(req.params.id, function(err, fabric){
    if (err) {
      req.flash("error", "Fabric not found");
      res.redirect("back");
    } else {
      res.render("fabrics/show", {fabric: fabric});
    }
  })
});

//edit fabric routes
router.get("/:id/edit", middleware.checkOwner, function(req, res){
  Fabric.findById(req.params.id, function(err, fabric){
    res.render("fabrics/edit", {fabric: fabric});
  })
})
//update fabric route
router.put("/:id", middleware.checkOwner, function(req, res){
  Fabric.findByIdAndUpdate(req.params.id, req.body.fabric, function(err, fabric){
    res.redirect("/fabrics/"+req.params.id);
  })
})

//destroy route
router.delete("/:id", middleware.checkOwner, function(req, res){
  Fabric.findByIdAndRemove(req.params.id, function(err){
    res.redirect("/fabrics");
  })
})

module.exports = router;
