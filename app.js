const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Reviews = require("./models/reviews.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");

//connecting database
const MONGO_URL = "mongodb://127.0.0.1:27017/travelo";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
//alllist home page
app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/listing.ejs", { allListing });
  })
);
//newww
app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//to validate schema from joi
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(result);
  if (error) {
    let errMSg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//add created listing
app.post(
  "/listing",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  })
);

//show route
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Edit listing
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
//post edited listing
app.put(
  "/listing/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // {...req.body.listing} is for the reconstruction of the listing object with new values.
    res.redirect(`/listing/${id}`); //redirect to show page
  })
);

//delete listing
app.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  })
);
//reviews
app.post("/listings/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Reviews(req.body.review);
  listing.reviews.push(newReview._id);
  await newReview.save();
  await listing.save();
 res.redirect(`/listing/${listing._id}`);
});

app.get("/", (req, res) => {
  res.send("working");
});

app.use((err, req, res, next) => {
  // const { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).render("error", { error: message });
  res.render("error.ejs");
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { error: message });
  next(new ExpressError(400, "Page not found!!"));
});
app.listen(3000, () => {
  console.log("app is listening to port 3000");
});
