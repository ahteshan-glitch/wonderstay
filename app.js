require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session=require("express-session")
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user=require("./routes/user.js")
const passport=require("passport");
const localStrategy=require("passport-local")
const User = require("./models/user.js");

const flash=require("connect-flash");
const app = express();

// Database Connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ Connected to database"))
  .catch(err => console.error("❌ DB connection error:", err));

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// Routes
app.get("/", (req, res) => {
  res.render("/listings/home.ejs");
});
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Add this after session middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentuser=req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  
  next();
});



app.use("/listings", listings);              // Handles all listing-related routes
app.use("/listings/:id/review", reviews); 
app.use("/user",user)   // Handles reviews for listings

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on http://localhost:1000");
});
