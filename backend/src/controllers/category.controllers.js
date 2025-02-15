import { Category } from "../models/category.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCategoryWithSubCategory = async(req,res)=>{
    const {category, subcategory}= req.body;
    if(!(category||subcategory )){
        return res.status(401).json({message:"All fields are required"})
    }

    const categoryExists = await Category.findOne({
        $or:[{subcategory}]
    });

    if(categoryExists){
        return res.status(402).json({message:"Product category or subcategory already exists"})
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

export {
    addCategoryWithSubCategory,
    getAllCategories,
}