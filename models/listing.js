const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const defaultImg="https://unsplash.com/photos/white-and-blue-sea-waves-painting-63RnGWHVIXs"
const listingSchema=new Schema({
    title: {
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/white-and-blue-sea-waves-painting-63RnGWHVIXs",
        set:(v)=>v==""?defaultImg:v,
    },
    price:String,
    location:String,
    country:String
});
const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;