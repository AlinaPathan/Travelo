const User=require("../models/user.js")

//get signup form
 module.exports.getSignup=(req, res) => {
  res.render("users/signup.ejs");
}
//post signup form

module.exports.postSignupForm=async (req, res) => {
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
  }


//get login
 module.exports.getLogin=(req, res) => {
  res.render("users/login.ejs");
}
  //post login form
  module.exports.postLogin= async (req, res) => {
    req.flash("success","Welcome back to Travelo You are Logged in!!!")
    let redirectUrl=res.locals.redirectUrl||"/listing"
    res.redirect(redirectUrl)
}


//to logout

module.exports.logOut=(req,res)=>{
  req.logout((err)=>{
    if(err){
     return next(err)
    }
    req.flash("success","You are Logged out");
    res.redirect("/listing")
  })
}