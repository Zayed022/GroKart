import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCategoryWithSubCategory = async(req,res)=>{
    const {category, subcategory,minicategory}= req.body;
    if(!(category||subcategory|| minicategory )){
        return res.status(401).json({message:"All fields are required"})
    }
/*
    const categoryExists = await Category.findOne({
        $or:[{subcategory}]
    });

    if(categoryExists){
        return res.status(402).json({message:"Product category or subcategory already exists"})
    };
    */

    const miniCategoryExists = await Category.findOne({
        $or:[{minicategory}]
    });

    if(miniCategoryExists){
        return res.status(402).json({message:"Product category or minicategory already exists"})
    };



    const imageLocalPath = req.files?.image[0]?.path
    console.log(imageLocalPath)
    if(!imageLocalPath){
        return res.status(400).json({message:"Image file is required"});
    }
    const image = await uploadOnCloudinary(imageLocalPath)
    if(!image){
        return res.status(400).json({message:"Image file is required"})
    }

    const categoryAndSubCategory = await Category.create({
        category,
        subcategory,
        image:image.url,
        minicategory,

    })
    const createdCategory = await Category.findById(categoryAndSubCategory._id).select("");
    if(!createdCategory){
        return res.status(403).json({message:"Something went wrong"})
    };
    return res.status(201).json({
        message:"Category Created successfully",createdCategory
    })
}

const getAllCategories = async (req,res) =>{
    try{
        const categories = await Category.find();
        res.status(200).json(categories);
    }
    catch(error){
        res.status(500).json({message:"An error occured while fetching categories."})
    }
}

const getMiniCategoriesBySubcategory = async (req, res) => {
    try {
      const categoryName = decodeURIComponent(req.params.categoryName);
      const subcategoryName = decodeURIComponent(req.params.subcategoryName);
  
      if (!categoryName || !subcategoryName) {
        return res.status(400).json({ message: "Category and Subcategory are required" });
      }
  
      // Find all documents matching the category and subcategory
      const docs = await Category.find({
        category: categoryName,
        subcategory: subcategoryName,
      });
  
      if (docs.length === 0) {
        return res.status(404).json({ message: "Category or Subcategory not found" });
      }
  
      // Extract unique minicategories from the result
      const miniCategories = docs.map((doc) => doc.minicategory);
  
      return res.status(200).json({
        category: categoryName,
        subcategory: subcategoryName,
        miniCategories,
      });
    } catch (error) {
      console.error("Error fetching mini-categories:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  

export {
    addCategoryWithSubCategory,
    getAllCategories,
    getMiniCategoriesBySubcategory
}