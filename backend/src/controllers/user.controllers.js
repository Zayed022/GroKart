import { User } from "../models/user.models.js";
import {OAuth2Client} from "google-auth-library"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
//import {  sendOTP, verifyOTP } from "../utils/otpGenerate.utils.js";

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


const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!(name && email && password && phone)) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (userExists) {
      return res.status(409).json({ success: false, message: "User with phone or email already exists" });
    }

    const user = await User.create({ name, email, password, phone });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      return res.status(500).json({ success: false, message: "Error creating user" });
    }

    return res.status(201).json({
      success: true,
      data: createdUser,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};


const loginUser = async (req, res) => {
    const { email, phone, password } = req.body;

    // Input validation
    if (!(phone || email) || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email or phone
        const user = await User.findOne({ $or: [{ phone }, { email }] });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Verify password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Fetch logged-in user details (excluding sensitive fields)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

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
               message: "User logged in successfully",
               user: loggedInUser,
               token:accessToken
           });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logoutUser = async(req,res)=>{
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({message:"Logged out successfully"});
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        password: "GOOGLE_AUTH", // won't be used
        isGoogleUser: true,
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Fetch safe user details
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Google login successful",
        user: loggedInUser,
        token: accessToken,
      });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};
/*
const getUserProfile = async(req,res)=>{
  try{
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({error:"User not found"})
    }
    res.status(200).json(user);
  }
  catch(error){
    res.status(500).json({error:"An error occurred while fetching the profile"})
  }
}
  */

export const getLoggedInUserDetails = asyncHandler(async(req,res)=>{
  //console.log("1");
  return res
  .status(200)
  .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
  ))
})

const updateUserProfile = asyncHandler(async(req,res)=>{
  const {name,phone,email} = req.body
  if(!(phone || email)){
      throw new ApiError(400,"All fields are required")
  }
  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set:{
              name,
              email:email,
              phone

          }
      },
      {new: true}
  ).select("-password")
  return res
  .status(200)
  .json(new ApiResponse(200,user,"Account details updated successfully"))
});

const deleteUserAccount = async(req,res)=>{
  try{
    const user = await User.findByIdAndDelete(userId);
    if(!user){
      return res.status(404).json({error:"User not found"});
    }
    res.status(200).json({message:"Account deleted successfully"})
  }
  catch(error){
    res.status(500).json({error:"An error occurred while deleting the user"})
  }
}






export {registerUser,
     loginUser,
     logoutUser,
     //getUserProfile,
     updateUserProfile,
     deleteUserAccount
    }