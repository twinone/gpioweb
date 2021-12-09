import React, { useEffect, useState } from "react";
import Axios from "axios";
import socketIOClient from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";

import { RelayComponent } from "../relay/relay";
import { Toaster } from "../../shared";

const useStyles = makeStyles((theme) => ({
  relaysContainer: {
    display: "flex",
    flexWrap: "wrap",
    "& div": {
      margin: "10px",
    },
  },
}));

const apiUrl = process.env.REACT_APP_API_URL;

const getChangedRelays = (previewRelays, newRelays) => {
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

const showChangedRelayInToaster = (relay) => {
  Toaster.showInfo(
    `Relay ${relay.title} ${
      relay.status === "on" ? "started" : "stopped"
    } (Auto : ${relay.manual ? "off" : "on"}).`
  );
};

export const RelaysComponent = () => {
  const classes = useStyles();
  const [relays, setRelays] = useState([]);
  const [relayChanged, setRelayChanged] = useState({});

  // Load list of relays
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
    socket.on(
      "relay_changed",
      (data) => {
        console.log("RECEIVED SOCKET MSG!");
        const newRelays = JSON.parse(data);

        setRelays((previewRelays) => {
          const affectedRelays = getChangedRelays(previewRelays, newRelays);
          affectedRelays.forEach(showChangedRelayInToaster);
          return newRelays;
        });
      },
      []
    );

    //effect cleanup
    return () => {
      socket.disconnect();
    };
  }, [relays, setRelays]);

  // Send relay changes to backend
  useEffect(() => {
    if (!relayChanged.status) {
      return;
    }

    if (relayChanged.manual) {
      Axios.post(
        `${apiUrl}/relay/${relayChanged.gpio}/${relayChanged.status}`
      ).catch((error) => console.log(error));
    } else {
      Axios.post(`${apiUrl}/relay/${relayChanged.gpio}/auto`).catch((error) =>
        console.log(error)
      );
    }
  }, [relayChanged]);

  const renderedRelays = relays.map((relay) => (
      <RelayComponent
        key={relay._id}
        relay={relay}
        onToggle={setRelayChanged}
      />
    ));

  return <div className={classes.relaysContainer}>{renderedRelays}</div>;
};
