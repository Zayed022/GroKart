import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
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
    isPaid: {
      type: Boolean,
      default: false,
    },

    //CashfreeOrderId: String,
    //razorpayPaymentId: String,
    //razorpaySignature: String,

    receipt: String,

    paymentMethod: {
      type: String,
      enum: ["cashfree", "cod"],
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
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Placed",
        "Assigned",
      ],
      default: "Pending",
    },
    statusHistory: [
  {
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "Out for Delivery", "Delivered","Cancelled","Placed","Assigned"],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    address: {
      type: String,
      required: true,
    },
    addressDetails: {
      type: Object,
      default: {},
    },

    notes: {
      type: Object,
      default: {},

      
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
      },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
