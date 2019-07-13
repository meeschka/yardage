var mongoose = require("mongoose");

var fabricSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
module.exports = mongoose.model("Fabric", fabricSchema);
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
// var tempFabricsArray = [
// {
//   name: "Grey wool",
//   image: "/assets/fabric1.jpg",
//   description: "A grey wool I purchased in Paris"
// },
// {
//   name: "Cotton broadcloth",
//   image: "/assets/fabric2.jpg",
//   description: "A bunch of basic white cotton broadcloth, stocked up at a clearance sale"
// },
// {
//   name: "Neon pink silk",
//   image: "/assets/pinkfabric.jpg",
//   description: "It's so bright and fun!"
// },
// {
//   name: "Grey wool",
//   image: "/assets/fabric1.jpg",
//   description: "A grey wool I purchased in Paris"
// },
// {
//   name: "Cotton broadcloth",
//   image: "/assets/fabric2.jpg",
//   description: "A bunch of basic white cotton broadcloth, stocked up at a clearance sale"
// },
// {
//   name: "Neon pink silk",
//   image: "/assets/pinkfabric.jpg",
//   description: "It's so bright and fun!"
// }
// ];
