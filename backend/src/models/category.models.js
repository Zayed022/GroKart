import mongoose,{Schema} from "mongoose"

const categorySchema = new Schema({
    category:{
        type:String,
        required:true,
    },
    subcategory:{
        type:String,
        required:true,
    },
    minicategory:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    
},{timestamps:true});

export const Category = mongoose.model("Category",categorySchema)