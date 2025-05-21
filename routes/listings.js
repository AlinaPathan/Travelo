const express=require("express")
const router=express.Router();
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
//controller file
const listingController=require("../controllers/listings.js");



//alllist home page
router.get(
  "/",
  wrapAsync(listingController.allListing)
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
  wrapAsync(listingController.postNewListing)
);

//show route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

//Edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);
//post edited listing
router.put(
  "/:id",
    isLoggedIn,
    isOwner,
  validateListing,
  wrapAsync(listingController.postEditedListing)
);

//delete listing
router.delete(
  "/:id",
    isLoggedIn,
    isOwner,
  wrapAsync(listingController.deleteListing)
);


module.exports=router;