import mongoose, {Schema} from "mongoose"

const serviceAreaSchema = new Schema ({
    city:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
        unique:true,
    },
    coordinates:{
        lat:{
            type:Number,
            required:true,

        },
        lng:{
            type:Number,
            required:true,
        }
    }
},{timestamps:true});


export const ServiceArea = mongoose.model("ServiceArea",serviceAreaSchema)