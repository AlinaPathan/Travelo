const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const User = require("../models/user.js");
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const session=require("express-session")

//get signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//post signupform
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "User Registered Successfully!!");
      res.redirect("/listing");
    } catch (e) {
      req.flash("error", "User Already Exist.");
      res.redirect("/signup");
    }
  })
);

//get login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//post login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,   //automatically flash msg
  }),
  async (req, res) => {
    req.flash("success","Welcome back to Travelo You are Logged in!!!")
    res.redirect("/listing")
}
);
//passport.authenticate is a middleware that checks if user exist or not
module.exports = router;
