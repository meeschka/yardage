var express = require("express");
var router = express.Router({mergeParams: true});
var Fabric = require("../models/fabric");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'meeschka', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
router.post("/", middleware.isLoggedIn, upload.single('imageUpload'), async function(req, res){
  let imageUrl;
  if (req.body.imageType === "upload" && req.file.path){
    await cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the new fabric object
      imageUrl = result.secure_url;
    })
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }  else imageUrl = '/assets/fabric2.jpg';
  
  
    //get data from form, add to fabrics db
    var newFabric = {
      name: req.body.name,
      image: imageUrl,
      description: req.body.description,
      author: {id: req.user._id, username: req.user.username}
    }
    Fabric.create(newFabric, function(err, fabric){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/fabrics/"+fabric.id);
        //redirect back to fabrics
      }
  });
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
    req.flash("success", "Fabric deleted");
    res.redirect("/fabrics");
  })
})

module.exports = router;
