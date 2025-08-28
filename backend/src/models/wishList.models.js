import mongoose, { Schema } from "mongoose";

const wishListSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // each wishlist belongs to a user
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    
    notes:{
        type:Object,
        default:{},
    },
    phone:{
        type: Number,
        required: true,
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
    },
    shopAssigned:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
    },
    
  },
  { timestamps: true }
);

export const WishList = mongoose.model("WishList", wishListSchema);
