const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");
const projectCtrl = require('../controllers/projects');

//show all projects
router.get("/", projectCtrl.index)
//add new projects - post route
router.post("/", middleware.isLoggedIn, projectCtrl.create)
//new project entry page
router.get("/new", middleware.isLoggedIn, projectCtrl.new)
//project detail page
router.get("/:id", projectCtrl.show);
//edit project routes
router.get("/:id/edit", middleware.checkOwner, projectCtrl.edit)
//update project route
router.put("/:id", middleware.checkOwner, projectCtrl.update)

//destroy route
router.delete("/:id", middleware.checkOwner, projectCtrl.delete)

module.exports = router;
