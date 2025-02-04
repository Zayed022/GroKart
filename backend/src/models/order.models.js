import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
            },
        },
    ],
    totalAmount: {
        type:Number,
        required:true,
    },
    paymentMethod:{
        type:String,
        enum:["UPI","COD"],
        //required:true,
    },
    paymentStatus:{
        type:String,
        enum:["Pending","Paid"],
        default:"Pending",
    },
    status:{
        type:String,
        enum:["Pending","Processing","Out for Delivery","Delivered","Cancelled","Placed"],
        default:"Pending"
    },
    paymentId:{
        type:String,
        //required:true,
    },

    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null,
    },
    
    deliveryAddress:
        {
        houseNumber:{
            type:String,
        },
        floor:{
            type:String,
        },
        building:{
            type:String,
        },
        street:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            enum:["Bhiwandi"],
            default:"Bhiwandi",
        },
        state:{
            type:String,
            enum:["Maharashtra"],
            default:"Maharashtra",
        },
        pincode:{
            type:String,
            required:true,
        },
        coordinates:{
            lat:{
                type:Number,
                required:true,
            },
            lng:{
                type:Number,
                required:true
            },
        },
    },
    
},


{timestamps:true});

export const Order = mongoose.model("Order",orderSchema)