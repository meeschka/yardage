var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fabrics", {useNewUrlParser: true});

var app = express();
var port = 3000;

//schema setup
var fabricSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
var Fabric = mongoose.model("Fabric", fabricSchema);
// Fabric.create({
//   name: "Cotton broadcloth",
//   image: "/assets/fabric2.jpg",
//   description: "A bunch of basic white cotton broadcloth, stocked up at a clearance sale"
// }, function(err, fabric){
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("Newly created fabric: ");
//     console.log(fabric);
//   }
// })

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

var tempFabricsArray = [
{
  name: "Grey wool",
  image: "/assets/fabric1.jpg",
  description: "A grey wool I purchased in Paris"
},
{
  name: "Cotton broadcloth",
  image: "/assets/fabric2.jpg",
  description: "A bunch of basic white cotton broadcloth, stocked up at a clearance sale"
},
{
  name: "Neon pink silk",
  image: "/assets/pinkfabric.jpg",
  description: "It's so bright and fun!"
},
{
  name: "Grey wool",
  image: "/assets/fabric1.jpg",
  description: "A grey wool I purchased in Paris"
},
{
  name: "Cotton broadcloth",
  image: "/assets/fabric2.jpg",
  description: "A bunch of basic white cotton broadcloth, stocked up at a clearance sale"
},
{
  name: "Neon pink silk",
  image: "/assets/pinkfabric.jpg",
  description: "It's so bright and fun!"
}
];

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
