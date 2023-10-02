import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async()=>{
    mongoose.set('strictQuery',true);
    if(!process.env.MONGODB_URI) return console.log("MONGODB_URI is not defiend")
    if(isConnected) return console.log("Using existing database connection");
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true
        console.log("mongoose is connected")
    } catch (error:any) {
        console.log(error)
    }
} 