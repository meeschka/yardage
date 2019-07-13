var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Fabric = require("./models/fabric")
mongoose.connect("mongodb://localhost:27017/fabrics", {useNewUrlParser: true});

var app = express();
var port = 3000;


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/fabrics", function(req, res){
  Fabric.find({}, function(err, allFabrics){
    if(err) {
      console.log(err);
    } else {
      res.render("fabrics/index", {fabrics: allFabrics});
    }
  })

})

app.post("/fabrics", function(req, res){
  //get data from form, add to fabrics db
  var newFabric = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
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

app.get("/fabrics/new", function(req, res){
  res.render("fabrics/new");
})

app.listen(port, ()=>{
    console.log("Server has started");
});

app.get("/fabrics/:id", function(req, res){
  Fabric.findById(req.params.id, function(err, fabric){
    if (err) {
      console.log(err);
    } else {
      res.render("fabrics/show", {fabric: fabric});
    }
  })
});
