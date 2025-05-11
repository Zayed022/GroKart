import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(userId);
    const accessToken = deliveryPartner.generateAccessToken();
    const refreshToken = deliveryPartner.generateRefreshToken();
    deliveryPartner.refreshToken = refreshToken;
    await deliveryPartner.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerDeliveryPartner = async (req, res) => {
  try {
    const {
      email,
      name,
      password,
      phone,
      vehicleNumber,
      licenseNumber,
      isApproved,
      isAvailable,
    } = req.body;
    const existingDeliveryPartner = await DeliveryPartner.findOne({ email });
    if (existingDeliveryPartner) {
      return res
        .status(400)
        .json({ message: "Delivery Partner already exists" });
    }

    const pucProofLocalPath = req.files?.pucProof[0]?.path;
    console.log(pucProofLocalPath);
    if (!pucProofLocalPath) {
      return res.status(400).json({ message: "Puc Proof is required" });
    }
    const pucProof = await uploadOnCloudinary(pucProofLocalPath);
    if (!pucProof) {
      return res.status(400).json({ message: "Puc Proof is required" });
    }

    const licenseProofLocalPath = req.files?.licenseProof[0]?.path;
    console.log(licenseProofLocalPath);
    if (!licenseProofLocalPath) {
      return res.status(400).json({ message: "License Proof is required" });
    }
    const licenseProof = await uploadOnCloudinary(licenseProofLocalPath);
    if (!licenseProof) {
      return res.status(400).json({ message: "License Proof is required" });
    }
    //const hashedPassword = await bcrypt.hash(password,10);
    const newDeliveryPartner = new DeliveryPartner({
      name,
      email,
      phone,
      password,
      vehicleNumber,
      licenseNumber,
      isApproved,
      isAvailable,
      pucProof: pucProof.url,
      licenseProof: licenseProof.url,
    });
    await newDeliveryPartner.save();
    res
      .status(201)
      .json({ message: "Delivery Partner registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering delivery partner" });
  }
};

const deliveryPartnerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery Partner not found" });
    }

    if (!deliveryPartner.isApproved) {
      return res.status(403).json({ message: "Access Denied: Not approved" });
    }

    const isPasswordValid = await deliveryPartner.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      deliveryPartner._id
    );

    const loggedInDeliveryPartner = await DeliveryPartner.findById(
      deliveryPartner._id
    ).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Delivery Partner logged in successfully",
        data: {
          deliveryPartner: loggedInDeliveryPartner,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      });
  } catch (error) {
    console.error("Error logging in delivery partner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const logoutDeliveryPartner = async (req, res) => {
  const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  return res
    .status(201)
    .json({ message: "Delivery Partner logged out successfully" });
};

const getAllDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartners = await DeliveryPartner.find({});
    return res.status(200).json({
      success: true,
      count: deliveryPartners.length,
      data: deliveryPartners,
    });
  } catch (error) {
    console.error("Error fetching delivery partners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export {
  registerDeliveryPartner,
  deliveryPartnerLogin,
  logoutDeliveryPartner,
  getAllDeliveryPartner,
};
