import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import './relays.scss';

import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';
import { Relay } from '../../modules/relay';

export const RelaysComponent = function () {
    const [relays, setRelays] = useState([]);
    const [message, setMessage] = useState({});
    const [relayChanged, setRelayChanged] = useState(0);
    useEffect(() => {
        const socket = socketIOClient(`${Config.ApiUrl}`);
        
        socket.on('connect', function () {
            socket.emit('my event', {
                data: 'User Connected'
            })
        });
    
        socket.on("API event", data => {
            var parsedData = JSON.parse(data);
            setMessage(parsedData);
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        Axios.get(`${Config.ApiUrl}/relay`)
            .then(response => {
                setRelays(response.data.relays
                    .map(relay => new Relay(relay.GPIO, relay.title, relay.status)));
                console.log('relays refreshed');
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() =>{
        relays.forEach(r => {
            if(r.GPIO === message.GPIO && r.status !== message.status) {
                r.status = message.status;
                console.log('Websockets', r);
                setRelays(relays);
                setRelayChanged(relayChanged + 1);
            }
        });
    }, [message]);

    function handleOnRelayToggle(relay) {
        Axios.get(`${Config.ApiUrl}/relay/${relay.GPIO}/${relay.status}`)
        .then(response => {})
        .catch(error => {
            console.log(error);
        });
    }
    return (<>
        <h1>Relays</h1>
        <div className="relaysContainer">
            {relays.map((relay, index) => (
                <RelayComponent key={index} relay={relay} onToggle={handleOnRelayToggle}/>))}
        </div>
    </>);
}