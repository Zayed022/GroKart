import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import { Admin } from "../models/admin.model.js";
import { Shop } from "../models/shop.model.js";

export const verifyJWT = asyncHandler(async(req,_res,next)=>{
    try {
        //console.log(req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        //console.log(token)
        if(!token) {
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid access Token")
    }
})

export const verifyJWTDelivery = asyncHandler(async(req,_res,next)=>{
    try {
        //console.log(req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        //console.log(token)
        if(!token) {
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const delivery = await DeliveryPartner.findById(decodedToken?._id).select("-password -refreshToken")
        if(!delivery){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.delivery=delivery;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid access Token")
    }
})

export const verifyJWTShop = asyncHandler(async(req,_res,next)=>{
    try {
        //console.log(req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        //console.log(token)
        if(!token) {
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const shop = await Shop.findById(decodedToken?._id).select("-password -refreshToken")
        if(!shop){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.shop=shop;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid access Token")
    }
})

export const verifyJWTAdmin = asyncHandler(async (req, _res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!admin) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (!admin.isApproved) {
      throw new ApiError(403, "Access denied: Admin not approved");
    }

    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});


