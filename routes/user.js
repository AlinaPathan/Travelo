const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const User = require("../models/user.js");
const passport=require("passport")

const { saveRedirectUrl } = require("../middleware.js");

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
      //if user sign up it should be automatically login user
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err)
        }
       req.flash("success", "Welcome To Travelo!!!");
      res.redirect("/listing");
      })
 
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,   //automatically flash msg
  }),
  async (req, res) => {
    req.flash("success","Welcome back to Travelo You are Logged in!!!")
    let redirectUrl=res.locals.redirectUrl||"/listing"
    res.redirect(redirectUrl)
}
);
//passport.authenticate is a middleware that checks if user exist or not

//to logout
router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
     return next(err)
    }
    req.flash("success","You are Logged out");
    res.redirect("/listing")
  })
})


module.exports = router;
