import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"

const addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    subCategory,
    miniCategory,
  } = req.body;
  if (!(name || description || price || category || stock)) {
    return res.status(401).json({ message: "All fields are required" });
  }
  /*
  const productExists = await Product.findOne({
    $or: [{ name }, { description }],
  });
  
  if (productExists) {
    return res
      .status(404)
      .json({ message: "Product with name or description already exists" });
  }
      */
  const imageLocalPath = req.files?.image[0]?.path;
  console.log(imageLocalPath);
  if (!imageLocalPath) {
    return res.status(400).json({ message: "Image file is required" });
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    subCategory,
    miniCategory,
    image: image.url,
  });
  const createdProduct = await Product.findById(product._id).select("");
  if (!createdProduct) {
    return res.status(500).json({ message: "SOmething went wrong" });
  }
  return res.status(201).json({
    createdProduct,
    message: "Product created successfully",
  });
};

const getAllProducts = async (req, res) => { 
  try { 
    console.log("Trying to fetch all products..."); 
    const products = await Product.find();
    console.log("Fetched products:", products); 
    console.log(products.length);
    res.status(200).json(products);
  }
  catch (error) { 
    console.log("Error fetching products:", error.message);
    res.status(500).json({ message: "An error occurred while fetching products." }); 
  }
};

const getProductsAll = async (req, res) => {
  try {
    console.log("Trying to fetch all products...");

    const products = await Product.find();

    console.log("Total products fetched:", products.length);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};




const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching the product." });
  }
};

const updateProductDetails = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const { id } = req.params; // Product ID from URL

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          stock,
          price,
          description,
          category,
        },
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product details updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product deleted successfully" });
};

const getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    let sortOptions = {};
    if (sort === "price_asc") {
      sortOptions.price = 1;
    } else if (sort === "price_desc") {
      sortOptions.price = -1;
    } else if (sort === "newest") {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching products",
    });
  }
};


const getProductsByCategory = async (req, res) => {
  const category = req.params;
  if (!category) {
    return res.status(401).json({ message: "Category is required" });
  }
  try {
    const products = await Product.find({
      category: { $regex: new RegExp(`^${ category }$`, "i") }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    return res.status(200).json({ message: "Products fetched successfully", products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategory } = req.params;

    if (!subCategory) {
      return res.status(400).json({ message: "Sub-category is required" });
    }

    const products = await Product.find({ subCategory }).sort({ name: 1 });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this sub-category" });
    }

    return res.status(200).json({ message: "Products fetched", products });
  } catch (error) {
    console.error("Error fetching products by sub-category:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getHomePageProducts = async (req, res) => {
  try {
    const subCategories = await Product.distinct('subCategory');
    const limit = parseInt(req.query.limit) || 10;

    const result = {};

    for (const subCategory of subCategories) {
      const products = await Product.find({ subCategory }).limit(limit);
      result[subCategory] = products;
    }

    return res.status(200).json({ message: "Homepage products fetched", data: result });
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



const getProductsByMiniCategory = async (req, res) => {
  const { miniCategory } = req.params;
  console.log("Requested miniCategory:", miniCategory);

  if (!miniCategory) {
    return res.status(400).json({ message: "Mini category is required" });
  }

  try {
    const products = await Product.find({
      miniCategory: { $regex: new RegExp(`^${miniCategory}$`, "i") }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this mini category" });
    }

    return res.status(200).json({ message: "Products fetched successfully", products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};





const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    if (!categories || categories.length === 0) {
      return res.status(401).json({ message: "No category found" });
    }
    return res
      .status(201)
      .json({ message: "All categories fetched successfully", categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSubCategories = async (req, res) => {
  const subCategories = await Product.distinct("subCategory");
  if (!subCategories || subCategories.length === 0) {
    return res.status(401).json({ message: "No Sub-Categories found" });
  }
  return res
    .status(201)
    .json({ message: "Sub-Categories fetched", subCategories });
};

const getAllMiniCategories = async (req, res) => {
    try {
      console.log("Fetching miniCategories...");
  
      // Fetch all miniCategory values (including duplicates)
      const miniCategoriesRaw = await Product.find({}, { miniCategory: 1, _id: 0 });
  
      console.log("Raw miniCategories:", miniCategoriesRaw);
  
      // Extract unique values using Set
      const miniCategories = [...new Set(miniCategoriesRaw.map((item) => item.miniCategory))];
  
      console.log("Unique miniCategories:", miniCategories);
  
      if (!miniCategories.length) {
        return res.status(404).json({ message: "No mini-category found" });
      }
  
      return res.status(200).json({
        message: "Mini-Categories fetched successfully",
        miniCategories,
      });
  
    } catch (error) {
      console.error("Error fetching miniCategories:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  

const getCategoriesWithSubCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Product.distinct("subCategory", {
          category,
        });
        return {
          category,
          subcategories,
        };
      })
    );
    return res.status(200).json({ success: true, data: categoryData });
  } catch (error) {
    console.error("Error fetching categories with subcategories", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateStock = async (req, res) => {
  try {
    const { productId, productName, stock } = req.body;

    if (!productId && !productName) {
      return res.status(400).json({ message: "Product ID or Name is required." });
    }

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Valid stock is required." });
    }

    const query = productId
      ? mongoose.Types.ObjectId.isValid(productId)
        ? { _id: productId }
        : null
      : { name: productName };

    if (!query) {
      return res.status(400).json({ message: "Invalid Product ID format." });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      query,
      { $set: { stock } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({
      message: "Stock updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Stock Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const resetAllStock = async (req, res) => {
  try {
    const result = await Product.updateMany({}, { $set: { stock: 0 } });

    return res.status(200).json({
      message: "All product stocks have been reset to 0.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Reset All Stock Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const setStockToEightIfZeroOrLess = async (req, res) => {
  try {
    const result = await Product.updateMany(
      { stock: { $lte: 0 } },
      { $set: { stock: 8 } }
    );

    return res.status(200).json({
      message: "Stock updated to 8 for all products with stock <= 0.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Set Stock Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const setStockZeroBySubCategory = asyncHandler(async (req, res) => {
  const { subCategory } = req.params;

  if (!subCategory) {
    return res.status(400).json({ message: "SubCategory is required" });
  }

  const result = await Product.updateMany(
    { subCategory: subCategory },
    { $set: { stock: 0 } }
  );

  res.status(200).json({
    message: `Stock set to 0 for ${result.modifiedCount} product(s) in subCategory '${subCategory}'`,
  });
});

const updateProductPrice = async (req, res) => {
  try {
    const { id, name, price } = req.body;

    if (!id && !name) {
      return res.status(400).json({ success: false, message: "Provide either product ID or name" });
    }

    if (!price) {
      return res.status(400).json({ success: false, message: "Price is required" });
    }

    let filter = id ? { _id: id } : { name };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Price updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProductDescription = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id && !name) {
      return res.status(400).json({ success: false, message: "Provide either product ID or name" });
    }

    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    let filter = id ? { _id: id } : { name };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Description updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProductImage = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id && !name) {
      return res.status(400).json({ success: false, message: "Provide either product ID or name" });
    }

    const imageLocalPath = req.files?.image?.[0]?.path;
    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // Upload to Cloudinary
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    let filter = id ? { _id: id } : { name };

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { image: uploadedImage.url },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductDetails,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByMiniCategory,
  getAllCategories,
  getAllSubCategories,
  getAllMiniCategories,
  getCategoriesWithSubCategories,
  getProductsAll,
  updateStock,
  resetAllStock,
  setStockToEightIfZeroOrLess,
  getHomePageProducts,
  setStockZeroBySubCategory,
  updateProductDescription,
  updateProductPrice,
  updateProductImage,
};
