import React, { useContext } from "react";

import SocketContext from "./socket-context";

const SocketProvider = (props) => {
  const socketContext = useContext(SocketContext);
  return (
    <SocketContext.Provider value={socketContext.socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
