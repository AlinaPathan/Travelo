const express=require("express")
const router=express.Router();
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
//controller file
const listingController=require("../controllers/listings.js");


//newww
router.get("/new",isLoggedIn,(req, res) => {
 
  res.render("listings/new.ejs");
});


router.route("/")
.get(wrapAsync(listingController.allListing))//get allisting page
.post(isLoggedIn,validateListing,wrapAsync(listingController.postNewListing));//post ne listing


router.route( "/:id")
.get(wrapAsync(listingController.showListing))//show listing route 
.put( isLoggedIn, isOwner,validateListing,wrapAsync(listingController.postEditedListing))//add edited listing
.delete(isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));//delete listing


//Edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);



module.exports=router;