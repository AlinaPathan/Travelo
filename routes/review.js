const express=require("express");
const router=express.Router();


const validateReview = (req, res, next) => {

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


//reviews

//post a review
router.post("/listing/:id/reviews",validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Reviews(req.body.review);
  listing.reviews.push(newReview._id);
  await newReview.save();
  await listing.save();
 res.redirect(`/listing/${listing._id}`);
}));


//delete a review
router.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id ,reviewId }=req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Reviews.findByIdAndDelete(reviewId)
  res.redirect(`/listing/${id}`)
}))
