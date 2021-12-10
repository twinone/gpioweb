import SocketContext, {socket} from "./socket-context";

const SocketProvider = (props) => {
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
