/*
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    
    app.listen(process.env.PORT||2000,()=>{
        console.log(`Server is running at PORT : ${process.env.PORT}`)
    })
    

})
.catch((err)=>{
    console.log("MongoDB connection failed!!!",err);
})
    */

import dotenv from "dotenv";
import http from "http"; // Import HTTP module
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initializeSocket } from "./utils/loaction.js"; // Import WebSocket setup

dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        const server = http.createServer(app); // Create HTTP server
        const PORT = process.env.PORT || 2000;

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server is running at PORT : ${PORT}`);
        });

        // Initialize WebSocket
        initializeSocket(server);
    })
    .catch((err) => {
        console.log("MongoDB connection failed!!!", err);
    });
