import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        default:0,
    },
    image:{
        type:String
    },
    
},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)
