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

  


export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const subcategories = JSON.parse(req.body.subcategories);

    const updatedSubcategories = [];

    for (let i = 0; i < subcategories.length; i++) {
      const sub = subcategories[i];
      const subImageFile = req.files[`subcategories[${i}][image]`]?.[0];
      const subImageUpload = await uploadOnCloudinary(subImageFile?.path);
      
      const miniCats = [];
      for (let j = 0; j < sub.miniCategories.length; j++) {
        const mini = sub.miniCategories[j];
        const miniImageFile = req.files[`subcategories[${i}][miniCategories][${j}][image]`]?.[0];
        const miniImageUpload = await uploadOnCloudinary(miniImageFile?.path);

        miniCats.push({
          name: mini.name,
          image: miniImageUpload?.secure_url,
        });
      }

      updatedSubcategories.push({
        name: sub.name,
        image: subImageUpload?.secure_url,
        miniCategories: miniCats,
      });
    }

    const newCategory = await Category.create({
      category,
      subcategories: updatedSubcategories,
    });

    res.status(201).json({ message: "Category created successfully", savedCategory: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while creating category." });
  }
};

export const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.aggregate([
      {
        $group: {
          _id: "$category",
          subcategories: { $addToSet: { name: "$subcategory", image: "$subcategoryImage" } },
        },
      },
    ]);

    return res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllMiniCategories = async (req, res) => {
  try {
    const allMiniCategories = await Category.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            subcategory: "$subcategory",
            image: "$image",
          },
          minicategories: {
            $push: {
              name: "$minicategory",
              
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          subcategories: {
            $push: {
              name: "$_id.subcategory",
              minicategories: "$minicategories"
            }
          }
        }
      }
    ]);

    res.status(200).json({
      message: "MiniCategories fetched successfully",
      data: allMiniCategories
    });
  } catch (error) {
    console.error("Error fetching miniCategories:", error);
    res.status(500).json({ message: "An error occurred while fetching miniCategories" });
  }
};

// Update Category/Subcategory Image
const updateCategoryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const imageLocalPath = req.files?.image?.[0]?.path;
    if (!imageLocalPath) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const image = await uploadOnCloudinary(imageLocalPath);
    if (!image) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    // ✅ update only image, skip validation of other required fields
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { image: image.url },
      { new: true, runValidators: false }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category image updated successfully",
      updatedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};



  
  

export {
    addCategoryWithSubCategory,
    getAllCategories,
    getMiniCategoriesBySubcategory,
    updateCategoryImage
}