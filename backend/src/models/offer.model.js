import mongoose, {Schema} from "mongoose"

const offerSchema = new Schema ({
    code:{
        type:String,
        unique:true,
        required:true,
    },
    discountType:{
        type:String,
        enum:["percentage","fixed"],
        required:true,
    },
    discountValue:{
        type:Number,
        required:true,
    },
    minOrderValue:{
        type:Number,
        default:0,
    },
    maxDiscount:{
        type:Number,
        default:null,
    },
    applicableProducts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    validFrom:{
        type:Date,
        required:true,
    },
    validTo:{
        type:Date,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    }
});

export const Offer = mongoose.model("Offer",offerSchema)