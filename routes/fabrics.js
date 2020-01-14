const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");
const fabricCtrl = require('../controllers/fabrics')
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})



//show all fabrics
router.get("/", fabricCtrl.index)
//add new fabric - post route
router.post("/", middleware.isLoggedIn, upload.single('imageUpload'), fabricCtrl.create)
//new fabric entry page
router.get("/new", middleware.isLoggedIn, fabricCtrl.new)
//fabric detail page
router.get("/:id", fabricCtrl.show);

//edit fabric routes
router.get("/:id/edit", middleware.checkOwner, fabricCtrl.edit)
//update fabric route
router.put("/:id", middleware.checkOwner, upload.single('imageUpload'), fabricCtrl.update)

//destroy route
router.delete("/:id", middleware.checkOwner, fabricCtrl.delete)

module.exports = router;
