const express=require("express")
const router=express.Router();
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")




//alllist home page
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/listing.ejs", { allListing });
  })
);
//newww
router.get("/new",isLoggedIn,(req, res) => {
 
  res.render("listings/new.ejs");
});



//add created listing
router.post(
  "/",
    isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing created successfuly!!!")
    res.redirect("/listing");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    console.log(listing)
    res.render("listings/show.ejs", { listing });
  })
);

//Edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
    req.flash("error","Listing Does Not Exist.");
    res.redirect("/listing");

    }
    res.render("listings/edit.ejs", { listing });
  })
);
//post edited listing
router.put(
  "/:id",
    isLoggedIn,
    isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // {...req.body.listing} is for the reconstruction of the listing object with new values.
   req.flash("success","Listing Updated Successfully!!")
    res.redirect(`/listing/${id}`); //redirect to show page
  })
);

//delete listing
router.delete(
  "/:id",
    isLoggedIn,
    isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!")
    res.redirect("/listing");
  })
);


module.exports=router;