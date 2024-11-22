// src/lib/socket.js
import { io ,Socket} from "socket.io-client";

let socket : Socket | null = null

export const initializeSocket = () => {
    if (!socket) {
        socket = io("http://localhost:5000");
        alert(socket.id)   
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error("Socket.io has not been initialized. Call initializeSocket first.");
    }
    return socket;
};
