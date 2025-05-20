const Listing=require("./models/listing");
const Review = require("./models/reviews.js");
const { listingSchema} = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
 

//to validate schema from joi
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError( errMsg,400);
  } else {
    next();
  }
};

//to validate review
module.exports.validateReview = (req, res, next) => {
  if (req.body.review && req.body.review.comment) {
    req.body.review.comment = req.body.review.comment.trim();
  }

  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


 module.exports.isLoggedIn=(req,res,next)=>{
      if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;//saved the url before redirecting to login
    req.flash("error","Please Login to create new listing.")
   return res.redirect("/login")
  }
  next()
 }
 

 module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;

  }

      next();
 }
 

 //to edit and delete listing
module.exports.isOwner=async(req,res,next)=>{
   let { id } = req.params;
   let 
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing.");
   return  res.redirect(`/listing/${id}`)
  }
  next()
}


//to delete review
module.exports.isAuthor=async(req,res,next)=>{
   let {id, reviewId } = req.params;
  let review= await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this review");
   return  res.redirect(`/listing/${id}`)
  }
  next()
}