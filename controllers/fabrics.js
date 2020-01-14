const Fabric = require("../models/fabric");
const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'meeschka', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const index = function(req, res){
    Fabric.find({}, function(err, allFabrics){
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      } else {
        res.render("fabrics/index", {fabrics: allFabrics});
      }
    })
  }
const create = async function(req, res){
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
            req.flash('error', err.message);
            return res.redirect('back');
        } else {
          res.redirect("/fabrics/"+fabric.id);
          //redirect back to fabrics
        }
    });
  }
const newFabric = function(req, res){
    res.render("fabrics/new");
  }
const show = function(req, res){
    Fabric.findById(req.params.id, function(err, fabric){
      if (err) {
        req.flash("error", "Fabric not found");
        res.redirect("back");
      } else {
        res.render("fabrics/show", {fabric: fabric});
      }
    })
  }
const edit = function(req, res){
    Fabric.findById(req.params.id, function(err, fabric){
      res.render("fabrics/edit", {fabric: fabric});
    })
  }
const update = function(req, res){
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
  }
const deleteFabric = function(req, res){
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
  }
module.exports = {
    index,
    create,
    new: newFabric,
    show,
    edit,
    update,
    delete: deleteFabric
}