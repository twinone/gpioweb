import { useEffect, useState, useCallback } from "react";
import Axios from "axios";

import { RelayComponent } from "../relay/relay";
import { Toaster } from "../../shared";

import styles from "./relays.module.scss";
import { socket } from "../../contexts/socket-context";
import SocketProvider from "../../contexts/SocketProvider";

const apiUrl = process.env.REACT_APP_API_URL;

const identifyModifiedRelays = (previewRelays, newRelays) => {
  const affectedRelays = [];
  previewRelays.forEach((relay) => {
    const newRelay = newRelays.filter(
      (newRelay) => newRelay.gpio === relay.gpio
    )[0];
    if (newRelay) {
      if (
        newRelay.status !== relay.status ||
        newRelay.manual !== relay.manual
      ) {
        affectedRelays.push(newRelay);
      }
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

  const relayChangedSocketMessageHandler = useCallback(data => {
    console.log('SOCKET!');
    const newRelays = JSON.parse(data);
    const affectedRelays = identifyModifiedRelays(relays, newRelays);
    affectedRelays.forEach(showRelayStatusInToaster);
    setRelays(newRelays);
  },[relays]);

  useEffect(() => {
    socket.on("relay_changed", relayChangedSocketMessageHandler);

    return () => socket.off("relay_changed", relayChangedSocketMessageHandler);
  }, [relayChangedSocketMessageHandler]);

  // Send relay changes to the backend
  useEffect(() => {
    if (!relayChanged.status) {
      return;
    }

    const postUrl = relayChanged.manual
      ? `${apiUrl}/relay/${relayChanged.gpio}/${relayChanged.status}`
      : `${apiUrl}/relay/${relayChanged.gpio}/auto`;
      
    Axios.post(postUrl).catch(error => console.log(error));
  }, [relayChanged]);

  const relayChangedHandler = relay => {
    setRelays(previousRelays => {
      let newRelays = [];

      const changedRelayIndex = previousRelays.findIndex(rel => rel._id === relay._id);

      for(let i = 0; i < previousRelays.length; i++) {
        newRelays.push(i === changedRelayIndex ? relay : previousRelays[i]);
      }

      return newRelays;
    });
    setRelayChanged(relay);
  }

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
