import mongoose from "mongoose";

import { ServiceArea } from "./src/models/serviceArea.model.js";

const serviceableAreas = [
    {
        city:"Bhiwandi",
        pincode:"421302",
        coordinates:{
            lat: 19.2813,
            lng: 73.0483
        }
    },
];

export const seedServiceAreas = async () =>{
    try{
        await ServiceArea.insertMany(serviceableAreas);
        console.log("Service areas added successfully!");
        process.exit();
    }
    catch(error){
        console.log("Error seeding service areas:", error);
        process.exit(1);
    }
}