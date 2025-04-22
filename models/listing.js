const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const defaultImg="https://unsplash.com/photos/a-lake-with-mountains-in-the-background-and-clouds-in-the-sky-GxSAX1Du5-o";

const listingSchema=new Schema({
    title: {
        type:String,
        required:true
    },
    description:String,
    image: {
        type: String,
        default: defaultImg,
        set: (v) => !v ? defaultImg : v
      },
    price:String,
    location:String,
    country:String
});
const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;