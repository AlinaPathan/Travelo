const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const { reviewSchema } = require("../schema.js");

const defaultImg =
  "https://unsplash.com/photos/a-lake-with-mountains-in-the-background-and-clouds-in-the-sky-GxSAX1Du5-o";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: defaultImg,
    set: (v) => (!v ? defaultImg : v),
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ]
});

//to delete all the reviews of the listing when we delete listings
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
