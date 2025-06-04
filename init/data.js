
const mongoose = require("mongoose");
const maindata=require("./database.js")
const Listing=require("../models/listing.js")


main()
.then(()=>{console.log("connect to database")})
.catch(err=>{console.log(err)})
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
}
const initData=async ()=>{
    await Listing.deleteMany({})
    maindata.data= maindata.data.map((obj)=>({...obj,owner:"68304a8c8deedf2a063eea43"}))
    await Listing.insertMany(maindata.data)
    console.log("data successfully initialised")
}
initData()




