import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import './relays.scss'
import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';
import { Relay } from '../../modules/relay';
import socketIOClient from "socket.io-client";

export const RelaysComponent = function() {
    const socket = socketIOClient(`${Config.ApiUrl}`);
    const [relays, setRelays] = useState([]);

    const [response, setResponse] = useState("");

    useEffect(() => {
        socket.on( 'connect', function() {
            socket.emit( 'my event', {
              data: 'User Connected'
            })
        });

        socket.on("FromAPI", data => {
          setResponse(data);
        });

        return () => socket.disconnect();
      }, []);

    useEffect( () => {
        Axios.get(`${Config.ApiUrl}/status`)
        .then(response => {
            console.log(response);
            setRelays(response.data.devs);
        })
        .catch(error => console.log(error));
      }, []);

    const onRelayStatusChanged = (gpio, status) => {
        console.log(`Realy ${gpio} status changed to ${status}`);
        socket.emit('my event', {GPIO: gpio, status: status});
    }
    return(<>
    <h1>Relays</h1>
    <div className="relaysContainer">
        {relays.map( (relay, index) => (
            <RelayComponent key={index}
                relay={new Relay(relay.GPIO, relay.value, relay.direction, relay.title)}
                onStatusChanged = {(status) => onRelayStatusChanged(relay.GPIO, status)} />))}
    </div>
    </>);
}