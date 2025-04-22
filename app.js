const express=require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
//connecting database
const MONGO_URL='mongodb://127.0.0.1:27017/travelo';
async function main(){
    await mongoose.connect(MONGO_URL)
}
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err)

})
//alllist home page
app.get("/listing",wrapAsync(async(req,res)=>{
 const allListing= await Listing.find({})
 res.render("listings/listing.ejs",{allListing})
}))
//newww
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs")
})
//add created listing
app.post("/listing",wrapAsync(async(req,res,next)=>{
  
let newListing=new Listing(req.body.listing);
await newListing.save()
 res.redirect("/listing")
  
  
}));

//show route 
app.get("/listing/:id",wrapAsync(async (req,res)=>{
 let {id}=req.params;
const listing= await Listing.findById(id);
res.render("listings/show.ejs",{listing})
}))

//Edit listing
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
const listing= await Listing.findById(id);
res.render("listings/edit.ejs",{listing})
}))
//post edited listing
app.put("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
    // {...req.body.listing} is for the reconstruction of the listing object with new values.
   res.redirect(`/listing/${id}`)//redirect to show page
}))

//delete listing
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id)
  console.log(deletedListing)
  res.redirect("/listing")
})
)
app.get("/",(req,res)=>{
    res.send("working")
})
app.all("*",(req,res,next)=>{
    next(new ExpressError(400,"Page not found!!"));
})
app.use((err,req,res,next)=>{
   let{statusCode,message}=err;
   res.status(statusCode).send(message);
})

app.listen(3000,()=>{
    console.log("app is listening to port 3000")
})