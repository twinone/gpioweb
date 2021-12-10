import { useEffect, useState, useCallback, useContext } from "react";
import Axios from "axios";

import Utils from '../../modules/utils';

import { RelayComponent } from "../relay/relay";
import { Toaster } from "../../shared";
import { SocketContext } from "../../contexts/socket-context";
import SocketProvider from "../../contexts/SocketProvider";
import styles from "./relays.module.scss";

const apiUrl = process.env.REACT_APP_API_URL;

const identifyModifiedRelays = (previousRelays, newRelays) => {
  const affectedRelays = [];
  previousRelays.forEach((relay) => {
    const newRelay = newRelays.find((newRelay) => newRelay._id === relay._id);

    if (newRelay && !Utils.equals(relay, newRelay)) {
      affectedRelays.push(newRelay);
    }
  });

  return affectedRelays;
};

const showRelayStatusInToaster = (relay) => {
  Toaster.showInfo(
    `Relay ${relay.title} ${
      relay.status === "on" ? "started" : "stopped"
    } (Auto : ${relay.manual ? "off" : "on"}).`
  );
};

export const RelaysComponent = () => {
  const [relays, setRelays] = useState([]);
  const [relayChanged, setRelayChanged] = useState({});

  const socket = useContext(SocketContext).socket;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`${apiUrl}/relay`);
        setRelays(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const relayChangedSocketMessageHandler = useCallback(
    (data) => {
      const newRelays = JSON.parse(data);
      const affectedRelays = identifyModifiedRelays(relays, newRelays);
      affectedRelays.forEach(showRelayStatusInToaster);
      setRelays(newRelays);
    },
    [relays]
  );

  useEffect(() => {
    const message = "relay_changed";
    socket.on(message, relayChangedSocketMessageHandler);

    return () => socket.off(message, relayChangedSocketMessageHandler);
  }, [socket, relayChangedSocketMessageHandler]);

  // Send relay changes to the backend
  useEffect(() => {
    if (!relayChanged.status) {
      return;
    }

    const postUrl = relayChanged.manual
      ? `${apiUrl}/relay/${relayChanged.gpio}/${relayChanged.status}`
      : `${apiUrl}/relay/${relayChanged.gpio}/auto`;

    Axios.post(postUrl).catch((error) => console.log(error));
  }, [relayChanged]);

  const relayChangedHandler = (relay) => {
    setRelays((previousRelays) => {
      let newRelays = [];

      const changedRelayIndex = previousRelays.findIndex(
        (rel) => rel._id === relay._id
      );

      for (let i = 0; i < previousRelays.length; i++) {
        newRelays.push(i === changedRelayIndex ? relay : previousRelays[i]);
      }

      return newRelays;
    });
    setRelayChanged(relay);
  };

  return (
    <SocketProvider>
      <div className={styles.relaysContainer}>
        {relays.map((relay) => (
          <RelayComponent
            key={relay._id}
            relay={relay}
            onToggle={relayChangedHandler}
          />
        ))}
      </div>
    </SocketProvider>
  );
};
