//All the callbacks related to listing will be in this file.
const Listing=require("../models/listing")




//to show listting
module.exports.allListing=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/listing.ejs", { allListing });
  }


//post new listing
module.exports.postNewListing=async (req, res, next) => {
      let newListing = new Listing(req.body.listing);
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","New Listing created successfuly!!!")
      res.redirect("/listing");
    }


//show listing
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing)
    res.render("listings/show.ejs", { listing });
  }

//Edit listing
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
    req.flash("error","Listing Does Not Exist.");
    res.redirect("/listing");

    }
    res.render("listings/edit.ejs", { listing });
  }
//post editedlisting
module.exports.postEditedListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // {...req.body.listing} is for the reconstruction of the listing object with new values.
   req.flash("success","Listing Updated Successfully!!")
    res.redirect(`/listing/${id}`); //redirect to show page
  }
//delete listing
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!")
    res.redirect("/listing");
  }