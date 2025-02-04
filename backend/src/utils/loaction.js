import { Server } from "socket.io";

export const initializeSocket = (server) => {
    const io = new Server(app, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`⚡: A user connected with ID: ${socket.id}`);

        socket.on("updateLocation", (locationData) => {
            console.log("Received location update:", locationData);
            io.emit("locationUpdated", locationData); // Broadcast to all connected clients
        });

        socket.on("disconnect", () => {
            console.log(`❌: User disconnected ${socket.id}`);
        });
    });

    console.log("✅ WebSocket server initialized");
};
