import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

    console.log("Fetched products:", products); // See what we get

    res.status(200).json(products);
  } catch (error) {
    console.log("Error fetching products:", error.message); // better logging
    res.status(500).json({ message: "An error occurred while fetching products." });
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
  const { name, price, description, category, stock } = req.body;

  const product = Product.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        stock,
        price,
        description,
        category,
      },
    },
    { new: true }
  ).select("-");

  return res
    .status(200)
    .json({ message: "Product details updated successfully" });
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
    const totalProducts = await Product.countDocuments();
    res.status(200).json({
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occured while fetching products",
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

const getProductsBySubCatgeory = async (req, res) => {
  const { subCategory } = req.params;
  if (!subCategory) {
    return res.status(401).json({ message: "Sub-category is required" });
  }
  const products = await Product.find({ subCategory });
  if (products.length == 0) {
    return res.status(201).json({ message: "Product not found" });
  }
  return res.status(201).json({ message: "Products fetched", products });
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

export {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductDetails,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  getProductsBySubCatgeory,
  getProductsByMiniCategory,
  getAllCategories,
  getAllSubCategories,
  getAllMiniCategories,
  getCategoriesWithSubCategories,
};
