import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const deliveryPartnerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/, // assuming Indian 10-digit phone numbers
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  aadhaarProof:{
    type: String,
    required: true,
  },
  panCardProof:{
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  pucProof: {
    type: String, // File URL or path to uploaded proof
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  licenseProof: {
    type: String, // File URL or path to uploaded proof
  },
  isApproved: {
    type: Boolean,
    default: false, // Admin approves after review
  },
  isAvailable: {
    type: Boolean,
    default: false, // True when partner is online and ready to deliver
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

deliveryPartnerSchema.index({ location: "2dsphere" }); // For geolocation queries

deliveryPartnerSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

deliveryPartnerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
};

deliveryPartnerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


deliveryPartnerSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const DeliveryPartner = mongoose.model("DeliveryPartner",deliveryPartnerSchema);
