import React from 'react';
import socketIO from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;

const socket = socketIO(apiUrl);
export const SocketContext = React.createContext({
    socket: socket
});