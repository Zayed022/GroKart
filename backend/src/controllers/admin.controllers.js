import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.models.js";



const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const admin = await Admin.findById(userId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();
        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSafe:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
        
    }
}

const registerAdmin = async(req,res)=>{
    try{
        const {email,name, password,phone,isApproved} = req.body;
        if(!(email || name || password || phone)){
            return res.status(401).json({message:"All fields are required"})
        };
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message:"Admin already exists"})
        }

        //const hashedPassword = await bcrypt.hash(password,10);
        const newAdmin = new Admin({
            name,
            email,
            phone,
            password,
            isApproved
        });
        await newAdmin.save();
        return res.status(201).json({message:"Admin registered successfully"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Error registering admin"});
    }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isApproved) {
      return res.status(403).json({ message: "Access Denied: Not approved" });
    }

    const isPasswordValid = await deliveryPartner.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id
    );

    
    await admin.save();

    const loggedInAdmin = await Admin.findById(
      admin._id
    ).select("-password -refreshToken");

    const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
        };
        

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Admin logged in successfully",
        
          admin: loggedInAdmin,

          token: accessToken,
           
        
      });
  } catch (error) {
    console.error("Error logging in Admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.admin._id; // Assuming protected route with auth

    // Mark as unavailable
    

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res
      .status(201)
      .json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Error logging out admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admin = await Admin.find({});
    return res.status(200).json({
      success: true,
      count: admin.length,
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};





export {
    registerAdmin,
    adminLogin,
    logoutAdmin,
    getAllAdmin

}