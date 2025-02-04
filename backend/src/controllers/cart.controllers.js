import { Cart } from "../models/cart.models.js";
import  {Product} from "../models/product.models.js"
const addToCart = async(req,res)=>{
    try{
        const {userId, productId, quantity} = req.body;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({error:"Product not found"})
        }

        let cart = await Cart.findOne({user:userId});
        if(!cart){
            cart = new Cart({user: userId, items:[],totalPrice:0});
        }
        const existingItem = cart.items.find(item => item.product.toString()===productId);
        if(existingItem){
            existingItem.quantity+= quantity;
        }
        else{
            cart.items.push({product:productId,quantity});
        }
        cart.totalPrice = cart.items.reduce((total, item)=> total + item.quantity * product.price, 0);
        await cart.save();
        res.status(200).json({message:"Item added to cart ",cart})
    }
    catch(error){
        res.status(500).json({error:"Error adding items to cart"})
    }
}

const getCart = async(req,res)=>{
    try{
        const {userId} = req.params;
        const cart = await Cart.findOne({userId}).populate("items.product")
        if(!cart){
            return res.status(404).json({error:"Cart not found"});
        }

        res.status(200).json(cart);

    }catch(error){
        res.status(500).json({error:"Error fetching cart"})
    }
}

const removeFromCart = async(req,res)=>{
    try{
        const {userId, productId} = req.body;

        let cart = await Cart.findOne({user:userId}).populate("items.product");
        if(!cart){
            return res.status(400).json({error:"Cart not found"})
        }
        const itemIndex=cart.items.findIndex(item => item.product._id.toString()=== productId);
        if(itemIndex===-1){
            return res.status(404).json({error:"Product not found in cart"})
        }
        cart.items.splice(itemIndex, 1);
        cart.totalPrice = cart.items.reduce((total,item) => total + item.quantity * item.product.price, 0);
        await cart.save();
        res.status(200).json({message:"Item removed from cart", cart});
    }
    catch(error){
        console.log("Error removing item from cart:", error)
        res.status(500).json({error:"Error removing item from cart"})
    }
}

export {
    addToCart,
    getCart,
    removeFromCart,
}