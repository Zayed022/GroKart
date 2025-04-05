import mongoose, { Schema } from "mongoose";
import { Cart } from "./cart.models.js";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

     // Sum of item prices
    
    
    totalAmount: {
      type: Number,
      //required: true,
    },
    
    email:{
      type:String,
    },
   
    paymentMethod: {
      type: String,
      enum: ["UPI", "COD"],
      //required:true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Placed",
      ],
      default: "Pending",
    },
    paymentId: {
      type: String,
      //required:true,
    },

    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    address:{
      type:String,
      required:true,
    }
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
