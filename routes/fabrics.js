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
  let imageId = 1;
  if (req.body.imageType === "upload" && req.file.path){
    await cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the new fabric object
      imageUrl = result.secure_url;
      imageId = result.public_id;
    })
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }  else imageUrl = '/assets/fabric2.jpg';
  
  
    //get data from form, add to fabrics db
    var newFabric = {
      name: req.body.name,
      image: imageUrl,
      imageId: imageId,
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
router.put("/:id", middleware.checkOwner, upload.single('imageUpload'), function(req, res){
  Fabric.findById(req.params.id, async function(err, fabric){
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      if (req.body.imageType === 'upload' && req.file.path){
        try {
          await cloudinary.v2.uploader.destroy(fabric.imageId);
          let result = await cloudinary.v2.uploader.upload(req.file.path);
          fabric.imageId = result.public_id;
          fabric.image = result.secure_url;
        } catch (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
      } else if (req.body.imageUrl) {
        req.body.fabric.image = req.body.imageUrl;
      }
    }
    fabric.name = req.body.name;
    fabric.description = req.body.description;
    fabric.save();
    req.flash('success', 'Successfully updated!');
    res.redirect(`/fabrics/${fabric._id}`);
  })
  // if (req.body.imageType === "upload" && req.file.path){
  //   await cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
  //     // add cloudinary url for the image to the new fabric object
  //     req.body.fabric.image = result.secure_url;
  //     req.body.fabric.imageId = result.public_id;
  //   })
  // } else if (req.body.imageUrl) {
    
  // }  else req.body.fabric.image = '/assets/fabric2.jpg';
  // Fabric.findByIdAndUpdate(req.params.id, req.body.fabric, function(err, fabric){
  //   res.redirect("/fabrics/"+req.params.id);
  // })
})

//destroy route
router.delete("/:id", middleware.checkOwner, function(req, res){
  Fabric.findById(req.params.id, async function(err, fabric){
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    try {
      if (fabric.imageId !== 1 ) {
        await cloudinary.v2.uploader.destroy(fabric.imageId);
      }
      fabric.remove();
      req.flash('success', 'Fabric deleted successfully!');
      res.redirect("/fabrics");
    } catch (err) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
    }
  })
  // Fabric.findByIdAndRemove(req.params.id, function(err){
  //   req.flash("success", "Fabric deleted");
    
  // })
})

module.exports = router;
