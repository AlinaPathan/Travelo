const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

//get signup form
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

//post signupform
router.post("/signup",wrapAsync(async(req,res)=>{
try{
        let {username,email,password}=req.body;
  const newUser=  new User({email,username});
   const registeredUser=  await User.register(newUser,password)
  console.log(registeredUser)
  req.flash("success","User Registered Successfully!!")
  res.redirect("/listing")
}catch(e){
    req.flash("failure","User Already Exist.")
    res.redirect("/signup")
}
}))

module.exports=router;