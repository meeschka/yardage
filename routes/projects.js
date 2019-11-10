var express = require("express");
var router = express.Router({mergeParams: true});
var Project = require("../models/project");
var middleware = require("../middleware");

//show all projects
router.get("/", function(req, res){
  Project.find({}, function(err, allProjects){
    if(err) {
      console.log(err);
    } else {
      res.render("projects/index", {projects: allProjects});
    }
  })

})
//add new projects - post route
router.post("/", middleware.isLoggedIn, function(req, res){
  //get data from form, add to projects db
  var newProject = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: {id: req.user._id, username: req.user.username}
  }
  
  Project.create(newProject, function(err, project){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/projects");
    }
  })
})
//new project entry page
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("projects/new");
})
//project detail page
router.get("/:id", function(req, res){
  Project.findById(req.params.id, function(err, project){
    if (err) {
      req.flash("error", "Project not found");
      res.redirect("back");
    } else {
      res.render("projects/show", {project: project});
    }
  })
});

//edit project routes
router.get("/:id/edit", middleware.checkOwner, function(req, res){
  Project.findById(req.params.id, function(err, project){
    res.render("projects/edit", {project: project});
  })
})
//update project route
router.put("/:id", middleware.checkOwner, function(req, res){
  Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, project){
    res.redirect("/projects/"+req.params.id);
  })
})

//destroy route
router.delete("/:id", middleware.checkOwner, function(req, res){
  Project.findByIdAndRemove(req.params.id, function(err){
    req.flash("success", "Project deleted");
    res.redirect("/projects");
  })
})

module.exports = router;
