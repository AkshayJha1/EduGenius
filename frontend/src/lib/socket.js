import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000"; 

export const socket = io(SERVER_URL, {
    transports: ["websocket"], 
    reconnectionAttempts: 5,  
    autoConnect: false,      
});

socket.on("connect", () => {
    console.log("🔗 Connected to WebSocket Server:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.warn("⚠️ Disconnected:", reason);
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();  // Connect only if not already connected
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
