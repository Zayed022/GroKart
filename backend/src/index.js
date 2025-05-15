import dotenv from "dotenv";
import http from "http";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });

// Create HTTP server once
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "*" }
});

// Save `io` instance globally and in app context
global.io = io;
app.set("io", io);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Delivery partner connected: " + socket.id);

  // Delivery partner joins a room with their ID
  socket.on("join", (deliveryPartnerId) => {
    console.log(`Delivery partner ${deliveryPartnerId} joined room`);
    socket.join(deliveryPartnerId); // Used to send private notifications
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 2000;
    server.listen(PORT, () => {
      console.log(` Server is running at PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed!!!", err);
  });
