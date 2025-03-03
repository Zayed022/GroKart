import { User } from "../models/user.models.js";



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

const registerAdmin = async(req,res)=>{
    try{
        const {email,name, password,phone} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Admin already exists"})
        }

        //const hashedPassword = await bcrypt.hash(password,10);
        const newAdmin = new User({
            name,
            email,
            phone,
            password,
            isAdmin: true
        });
        await newAdmin.save();
        res.status(201).json({message:"Admin registered successfully"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Error registering admin"});
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (! email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email or phone
        const admin = await User.findOne({ email } );
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({ message: "Access Denied" });
        }

        // Verify password
        const isPasswordValid = await admin.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

        // Fetch logged-in user details (excluding sensitive fields)
        const loggedInAdmin = await User.findById(admin._id).select("-password -refreshToken");

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
               message: "Admin logged in successfully",
               user: loggedInAdmin,
           });
    } catch (error) {
        console.error("Error logging in user:", error);
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllAdmin = async(req,res)=>{
    try{
        const admin = await User.find({isAdmin:true})
        return res.status(201).json({
            success: true,
            count:admin.length,
            data: admin,
        });
    }
    catch(error){
        console.log("Error fetching admin",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}





export {
    registerAdmin,
    adminLogin,
    getAllAdmin

}