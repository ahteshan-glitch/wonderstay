const express = require("express");
const router = express.Router();
const passport=require("passport")

const User=require("../models/user.js")
const {savedUrl}=require("../middleware.js")
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})
router.post("/signup",async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newuser=new User({email,username});
    const registereduser=await User.register(newuser,password);
    req.login(registereduser,(err)=>{
        if(err){
        return next(err);}
        req.flash("success","welcome! to wonderstay")
        res.redirect("/listings")
    })
   
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/listings")
    }
   

})  
router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
}) 
router.post(
    "/login",
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Welcome back!");
      // after login...
      const redirectUrl = res.locals.redirectUrl || "/listings";
      // clear it so you don’t accidentally reuse it later
      delete req.session.redirectUrl;
      res.redirect(redirectUrl);
    }
  );
  
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("error","you successfully logout")
        res.redirect("/listings")
    })
})
module.exports = router;