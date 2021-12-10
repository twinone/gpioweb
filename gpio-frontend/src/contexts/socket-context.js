import React from 'react';
import socketIO from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;

export const socket = socketIO.connect(apiUrl);

const SocketContext = React.createContext({
    socket: socket
});

export default SocketContext;