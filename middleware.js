const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
// middleware.js

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
     
      if (req.method === "GET") {
        req.session.redirectUrl = req.originalUrl;
      } else if (req.headers.referer) {
        req.session.redirectUrl = req.headers.referer;
      }
      req.flash("error", "You must be logged in to perform this action.");
      return res.redirect("/user/login");
    }
    next();
  };
  
module.exports.savedUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}
module.exports.isowner=async(req,res,next)=>{
  const { id } = req.params;
  const listing=await Listing.findById(id)
  if(!listing.owner._id.equals(res.locals.currentuser._id)){
    req.flash("error","you have no authorisation to perform such action")
    return res.redirect(`/listings/details/${listing._id}`);
  }
  next();

}
module.exports.isauthor=async(req,res,next)=>{
    const {id,reviewId}=req.params
    const review =await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currentuser._id)){
        req.flash("error","you are not the author of the comment")
        return res.redirect(`/listings/${id}`)
    }
    next();
}