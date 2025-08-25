import { User } from "../models/user.models.js";

const isAdminTrue = async (req, res, next)=>{
    try{
        const admin = await User.find({isAdmin:true})
        if(!admin){
            return res.status(403).json({message:"Unauthorized access"})
        };
        req.user = admin;
        next();
    }
    catch(error){
        console.log("Invalid data ", error);
        return res.status(500).json({message:"Internal Server error"})
    }
}

export {isAdminTrue}