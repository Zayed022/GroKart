import { User } from "../models/user.models.js";

import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeForSafe:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
        
    }
}

const registerDeliveryPartner = async(req,res)=>{
    try{
        const {email,name, password,phone} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Delivery Partner already exists"})
        }

        //const hashedPassword = await bcrypt.hash(password,10);
        const newDeliveryPartner = new User({
            name,
            email,
            phone,
            password,
            isDeliveryPartner: true
        });
        await newDeliveryPartner.save();
        res.status(201).json({message:"Delivery Partner registered successfully"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Error registering delivery partner"});
    }
};

const deliveryPartnerLogin = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (! email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email or phone
        const deliveryPartner = await User.findOne({ email } );
        if (!deliveryPartner || !deliveryPartner.isDeliveryPartner) {
            return res.status(404).json({ message: "Access Denied" });
        }

        // Verify password
        const isPasswordValid = await deliveryPartner.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(deliveryPartner._id);

        // Fetch logged-in user details (excluding sensitive fields)
        const loggedInDeliveryPartner = await User.findById(deliveryPartner._id).select("-password -refreshToken");

        // Set cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
        };

        // Send response
        res.status(200)
           .cookie("accessToken", accessToken, options)
           .cookie("refreshToken", refreshToken, options)
           .json({
               message: "Delivery Partner logged in successfully",
               user: loggedInDeliveryPartner,
           });
    } catch (error) {
        console.error("Error logging in user:", error);
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

const logoutDeliveryPartner = async(req,res)=>{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(201).json({message:"Delivery Partner logged out successfully"})
}

const getAllDeliveryPartner = async(req,res)=>{
    try{
        const deliveryPartners = await User.find({isDeliveryPartner:true});
        return res.status(200).json({
            success:true,
            count: deliveryPartners.length,
            data: deliveryPartners
        });
    }
    catch(error){
        console.log("Error fetching delivery partners:",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


export {
    registerDeliveryPartner,
    deliveryPartnerLogin,
    logoutDeliveryPartner,
    getAllDeliveryPartner

}