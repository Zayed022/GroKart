import mongoose, { Schema } from "mongoose";

const mobileBannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required:  true,
    },
    redirectUrl:{
        type:String,
        required: true,
    },
    isActive:{
        type: Boolean,
        default: false,
    }
    
  },
  { timestamps: true }
);

export const MobileBanner = mongoose.model("MobileBanner", mobileBannerSchema);
