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

/*

//import mongoose from "mongoose";

const miniCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // image for miniCategory
});

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // image for subCategory
  miniCategories: [miniCategorySchema],
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // category name (no image)
    subCategories: [subCategorySchema],
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);

*/