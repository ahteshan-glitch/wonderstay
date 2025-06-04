const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅
const {isloggedin,isauthor}=require("../middleware.js")
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");

// Add Review
router.post("/", isloggedin,wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const review = new Review({ rating, comment,author:res.locals.currentuser._id });

  const listing = await Listing.findById(id);
  listing.reviews.push(review);
  await review.save();
  console.log(review)
  await listing.save();

  res.redirect(`/listings/details/${id}`);
}));

// Delete Review
router.delete("/:reviewId", isloggedin,isauthor,wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/details/${id}`);
}));

module.exports = router;
