// listing.js

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapasync.js");
const { isloggedin,isowner } = require("../middleware.js");
// Show All Listings
router.get("/", wrapAsync(async (req, res) => {
  const listing = await Listing.find({});
  res.render("listings/home.ejs", { listing });
}));

// Show New Listing Form
router.get("/new",  isloggedin,(req, res) => {
  res.render("listings/new.ejs");
});

// Create New Listing
router.post("/new",isloggedin,wrapAsync(async (req, res) => {
  const { title, image, description, price, location, country } = req.body;
  const newlisting = new Listing({
    title,
    image: { url: image },
    description,
    price,
    location,
    country,
    owner:req.user._id
  });
  await newlisting.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
}));

// Show Listing Details
router.get("/details/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const details = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
  if(!details){
    req.flash("error","listing does not exist")
    res.redirect("/listings")
  }
  
  res.render("listings/details.ejs", { details });
}));

// Show Edit Form
router.get("/edit/:id",isloggedin,isowner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const details = await Listing.findById(id);
  res.render("listings/edit.ejs", { details });
}));

// Update Listing
router.put("/edit/:id", isloggedin,isowner,wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;
  const listing = await Listing.findByIdAndUpdate(id, {
    title, description, price, location, country
  });
 

  
  req.flash("success","listing updated")
  res.redirect(`/listings/details/${listing._id}`);
}));

// Delete Listing
router.delete("/delete/:id",isloggedin,isowner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error","Listing deleted successfully")
  res.redirect("/listings");
}));

module.exports = router;
