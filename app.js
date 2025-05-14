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
const { listingSchema,reviewSchema } = require("./Schema.js");

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


//to validate schema from joi
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
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
app.post("/listing/:id/reviews",validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Reviews(req.body.review);
  listing.reviews.push(newReview._id);
  await newReview.save();
  await listing.save();
 res.redirect(`/listing/${listing._id}`);
}));

app.get("/", (req, res) => {
  res.send("working");
});

// 404 handler (for undefined routes)
app.use((req, res, next) => {
  res.status(404).render("error", { err: "Page not found!" });
});

// Global error handler (for all other errors)
app.use((err, req, res, next) => {
  console.error(err);  // log the error to the console
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { err : message });
});

app.listen(3000, () => {
  console.log("app is listening to port 3000");
});
