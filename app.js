var express = require("express");
var app = express();
var port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/fabrics", function(req, res){
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
  res.render("fabrics/index", {fabrics: tempFabricsArray});
})


app.listen(port, ()=>{
    console.log("Server has started");
});
