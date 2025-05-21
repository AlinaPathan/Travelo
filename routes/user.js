const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const User = require("../models/user.js");
const passport=require("passport")

const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js")





router.route("/signup")
.get(userController.getSignup)//get signup form
.post( wrapAsync(userController.postSignupForm));//post signupform

//get login form


router.route("/login")
.get(userController.getLogin)//get login form
.post(saveRedirectUrl,
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
