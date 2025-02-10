import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = async(req,res)=>{
    const {name, description, price , category, stock, subCategory, miniCategory} = req.body
    if(!(name || description || price || category || stock)){
        return res.status(401).json({message:"All fields are required"})
    }
    const productExists = await Product.findOne({
        $or:[{name},{description}]
    })
    if(productExists){
        return res.status(404).json({message:"Product with name or description already exists"})
    }
    const imageLocalPath = req.files?.image[0]?.path
    console.log(imageLocalPath)
    if(!imageLocalPath){
        return res.status(400).json({message:"Image file is required"});
    }
    const image = await uploadOnCloudinary(imageLocalPath)
    if(!image){
        return res.status(400).json({message:"Image file is required"})
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        subCategory,
        miniCategory,
        image:image.url,

    })
    const createdProduct = await Product.findById(product._id).select("");
    if(!createdProduct){
        return res.status(500).json({message:"SOmething went wrong"})
    }
    return res.status(201).json({
        createdProduct,
        message:"Product created successfully"
    })

}

const getAllProducts = async (req,res) =>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(error){
        res.status(500).json({message:"An error occured while fetching products."})
    }
}

const getProductById= async(req,res)=>{
    try{
        const { productId } = req.body; 
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({error:"Product not found"});
        }
        res.status(200).json(product);
    }
    catch(error){
        res.status(500).json({error:"An error occured while fetching the product."})
    }
}

const updateProductDetails=async(req,res)=>{
    const {name, price, description, category, stock}=req.body

    

    const product=Product.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                name,
                stock,
                price,
                description,
                category
            }
        },
        {new:true}
        ).select("-")


        return res
        .status(200)
        .json({message:"Product details updated successfully"})

}

const deleteProduct = async (req,res)=>{
    const {productId} = req.body;
    const product = await Product.findByIdAndDelete(productId);
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    res.status(200).json({message:"Product deleted successfully"})
}

const getProducts = async(req,res)=>{
    try{
        let {page = 1, limit= 10, search, category, minPrice, maxPrice, sort} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let filter = {};
        
        if(search){
            filter.name = {$regex : search, $options:"i"};
        }
        if(category){
            filter.category = category;
        }

        if(minPrice || maxPrice){
            filter.price = {};
            if(minPrice) filter.price.$gte = parseInt(minPrice);
            if(maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        let sortOptions = {};
        if(sort=== "price_asc"){
            sortOptions.price = 1;
        }
        else if(sort === "price_desc"){
            sortOptions.price = -1;
        }
        else if(sort === "newest"){
            sortOptions.createdAt = -1
        }
        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip((page-1)*limit)
            .limit(limit);
        const totalProducts = await Product.countDocuments();
        res.status(200).json({
            totalPages : Math.ceil(totalProducts/limit),
            currentPage: page,
            totalProducts,
            products,
        })
    }
    catch(error){
        res.status(500).json({
            error:"An error occured while fetching products"
        })
    }

}

const getProductsByCategory = async(req,res)=>{
    const category = req.params.category;
    if(!category){
        return res.status(401).json({message:"Category is required"})
    };
    const product = await Product.find({category});
    if(product.length==0){
        return res.status(402).json({message:"No product not in this category"})
    }
    return res.status(201).json({message:"Products fetched",product})
};

const getProductsBySubCatgeory = async(req,res)=>{
    const {subCategory} = req.params;
    if(!subCategory){
        return res.status(401).json({message:"Sub-category is required"})
    }
    const product = await Product.find({subCategory})
    if(product.length==0){
        return res.status(201).json({message:"Product not found"})
    }
    return res.status(201).json({message:"Products fetched"})
}

const getProductsByMiniCategory = async(req,res)=>{
    const {miniCategory} = req.params;
    if(!miniCategory){
        return res.status(401).json({message:"Category is required"})
    }
    const product = await Product.find({miniCategory})
    if(product.length==0){
        return res.status(402).json({message:"Product not found"})
    }
    return res.status(201).json({message:"Products fetched successfully"})
}

export {addProduct,
    getAllProducts,
    getProductById,
    updateProductDetails,
    deleteProduct,
    getProducts,
    getProductsByCategory,
    getProductsBySubCatgeory,
    getProductsByMiniCategory,

}