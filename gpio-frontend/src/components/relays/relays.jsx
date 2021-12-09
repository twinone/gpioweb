import React, { useEffect, useState } from "react";
import Axios from "axios";
import socketIOClient from "socket.io-client";

import { RelayComponent } from "../relay/relay";
import { Toaster } from "../../shared";

import styles from "./relays.module.scss";

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

  // When a relay has been changed form other place
  useEffect(() => {
    const socket = socketIOClient(`${apiUrl}`);
    socket.on("relay_changed", (data) => {
      const newRelays = JSON.parse(data);
      setRelays((prevRelays) => {
        const affectedRelays = identifyModifiedRelays(prevRelays, newRelays);
        affectedRelays.forEach(showRelayStatusInToaster);
        return newRelays;
      });
    });

    //effect cleanup
    return () => {
      socket.disconnect();
    };
  }, [setRelays]);

  const {gpio, status, manual} = relayChanged;
  // Send relay changes to backend
  useEffect(() => {
    if (!status) {
      return;
    }

    if (manual) {
      Axios.post(
        `${apiUrl}/relay/${gpio}/${status}`
      ).catch((error) => console.log(error));
    } else {
      Axios.post(`${apiUrl}/relay/${gpio}/auto`).catch((error) =>
        console.log(error)
      );
    }
  }, [gpio, status, manual]);

  const renderedRelays = relays.map((relay) => {
    return (
      <RelayComponent
        key={relay._id}
        relay={relay}
        onToggle={setRelayChanged}
      />
    );
  });

  return <div className={styles.relaysContainer}>
    {renderedRelays}
    </div>;
};
