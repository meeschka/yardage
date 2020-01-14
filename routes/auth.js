const express = require("express");
var router = express.Router({mergeParams: true});
const passport = require("passport");
const authCtrl = require('../controllers/auth')

//register page
router.get("/register", authCtrl.register)
//register logic
router.post("/register", authCtrl.addUser)
//login page
router.get("/login", authCtrl.login)
//login logic
router.post("/login", passport.authenticate("local",
  {successRedirect:"/fabrics",
  failureRedirect:"/login"}),
  function(req, res){
})
//logout
router.get("/logout", authCtrl.logout)

module.exports = router;
