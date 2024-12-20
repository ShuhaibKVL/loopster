  'use client'

import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('https://veloxattir.online',{ 
  transports: ['websocket', 'polling'],
  reconnection: true,  
})

const SocketContext = createContext<Socket>(socket);
  socket.on('connect', () =>{  
  })

  interface SocketProviderProps {
    children: React.ReactNode;
  }
  

const SocketProvider : React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };