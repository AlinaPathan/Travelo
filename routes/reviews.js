const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview}=require("../middleware.js")




//reviews

//post a review
router.post("/:id/reviews",validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview._id);
  await newReview.save();
  await listing.save();
 req.flash("success","Review Added!!")


 res.redirect(`/listing/${listing._id}`);
}));


//delete a review
router.delete("/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id ,reviewId }=req.params;
    if (!Listing) {
    return next(new ExpressError("Listing not found", 404));
  }
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId)
 req.flash("success","Review Deleted Successfully")


  res.redirect(`/listing/${id}`)
}))


module.exports=router;