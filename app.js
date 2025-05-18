const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Review = require("./models/reviews.js");
const Listing =require('./models/listing.js')
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const ExpressError = require("./utils/ExpressError.js");
const listing=require("./routes/listings.js")
const reviews=require("./routes/reviews.js")
const session=require("express-session")
const flash=require("connect-flash")


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

app.get("/", (req, res) => {
  res.send("working");
});


const sessionOptions={
  secret:"mysupersecretecoede",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7 * 24 * 60 * 60 *1000,//keeping user logged in for a week
    maxAge:7 * 24 * 60 * 60 *1000,
    httpOnly:true,
  },
}

app.use(session(sessionOptions))

app.use(flash())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.failure=req.flash("failure");
  console.log(res.locals.success)
  console.log(res.locals.failure)
  next();
})





//this line is for listings default route
app.use("/listing",listing)

//this line is for default reviews
app.use("/listing",reviews)




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
