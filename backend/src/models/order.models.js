import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customerId: {
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
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    receipt: String,

    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },

    codCharge: {
      type: Number,
      default: 0,
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

    address: {
      type: String,
      required: true,
    },

    notes: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
