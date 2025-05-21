//this file contain all the calback functions for reviews.
const Review = require("../models/reviews.js");
const Listing=require("../models/listing")

//post a review
module.exports.postReview=async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview._id);
  await newReview.save();
  await listing.save();
 req.flash("success","Review Added!!")
 res.redirect(`/listing/${listing._id}`);
}


module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    if (!Listing) {
      return next(new ExpressError("Listing not found", 404));
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");

    res.redirect(`/listing/${id}`);
  }