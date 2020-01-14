const Project = require("../models/project");
const index = function(req, res){
    Project.find({}, function(err, allProjects){
      if(err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        res.render("projects/index", {projects: allProjects});
      }
    })
  }
const newProject = function(req, res){
    res.render("projects/new");
  }
const create = function(req, res){
    //get data from form, add to projects db
    var newProject = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      author: {id: req.user._id, username: req.user.username}
    }
    Project.create(newProject, function(err, project){
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        res.redirect("/projects");
      }
    })
  }
const show = function(req, res){
    Project.findById(req.params.id, function(err, project){
      if (err) {
        req.flash("error", "Project not found");
        res.redirect("back");
      } else {
        res.render("projects/show", {project: project});
      }
    })
  }
const edit = function(req, res){
    Project.findById(req.params.id, function(err, project){
      res.render("projects/edit", {project: project});
    })
  }
const update = function(req, res){
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, project){
      res.redirect("/projects/"+req.params.id);
    })
  }
const deleteProject = function(req, res){
    Project.findByIdAndRemove(req.params.id, function(err){
      req.flash("success", "Project deleted");
      res.redirect("/projects");
    })
  }
module.exports = {
    index,
    new: newProject,
    create,
    show,
    edit,
    update,
    delete: deleteProject
}