"use client";

import { useEffect } from "react";
import { initializeSocket } from "@/lib/utils/socket"; 

const SocketInitializer = () => {
   
    useEffect(() => {
        const socket = initializeSocket();

        socket.on("connection", () => {
            console.log("Connected to Socket.IO server",socket.id);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return null;
};

export default SocketInitializer;
