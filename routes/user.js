const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const User = require("../models/user.js");
const passport=require("passport")

const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js")


//get signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//post signupform
router.post(
  "/signup",
  wrapAsync(userController.postSignupForm)
);

//get login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//post login
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,   //automatically flash msg
  }),
 userController.postLogin
);
//passport.authenticate is a middleware that checks if user exist or not

//to logout
router.get("/logout",userController.logOut)


module.exports = router;
