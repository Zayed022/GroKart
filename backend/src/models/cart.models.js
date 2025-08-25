import mongoose,{Schema} from "mongoose";

const cartSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
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
    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },

});


export const Cart = mongoose.model("Cart",cartSchema)