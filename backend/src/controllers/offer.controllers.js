import {Offer} from "../models/offer.model.js"
import { applyDiscount } from "./order.controllers.js";


const createOffer = async(req , res)=>{
    try{
        const offer = new Offer(req.body)
        await offer.save();
        res.status(201).json({message:"Offer created successfully",offer});
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
};

const getAllOffers = async(req, res)=>{
    const offers = await Offer.find({isActive:true});
    res.json(offers);
}

const applyCouponCode = async(req, res)=>{
    try{
        const {cart, couponCode} = req.body;
        const {discount } = await applyDiscount(cart,couponCode);
        res.json({message:"Discount applied", discount});
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}





export {
    createOffer,
    getAllOffers,
    applyCouponCode,
}