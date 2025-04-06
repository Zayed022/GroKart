import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    razorpayPaymentId :{
        type:String,
        sparse: true,
    },
    razorpayOrderId:{
        type: String,
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type: String,
        default: 'INR'
    },
    paymentMethod:{
        type: String,
        enum: ['razorpay','cod'],
        required: true
    },
    paymentMethodDetails:{
        method: String,
        cardId: String,
        bank: String,
        wallet: String,
        vpa: String,
        collectedBy : String,
        collectionTime: Date,
        collectionNotes: String
    },
    status:{
        type: String,
        enum: ['pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded', 'collected'],
        default: 'pending'
    },
    codCharge: {
        type: Number,
        default: 0
    },
    email: String,
    contact: String,
    error: {
        code: String,
        description: String,
        source: String,
        step: String,
        reason: String
    },
    notes: {
        type: Object,
        default: {}
    },
    refunds: [{
        razorpayRefundId: String,
        amount: Number,
        status: {
          type: String,
          enum: ['created', 'processed', 'failed']
        },
        speed: {
          type: String,
          enum: ['normal', 'optimum']
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
    },
    
   
}, { timestamps: true }
);

paymentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  export const Payment = mongoose.model("Payment", paymentSchema);