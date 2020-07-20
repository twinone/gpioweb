import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import './relays.scss';

import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';
import { withForceUpdate } from '../../hocs/withForceUpdate';

export const RelaysComponent = withForceUpdate(function () {
    const [relays, setRelays] = useState([]);
    const [relayChanged, setRelayChanged] = useState({});

    useEffect(() => {
        Axios.get(`${Config.ApiUrl}/relay`)
            .then(response => {
                setRelays(response.data.relays);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        const socket = socketIOClient(`${Config.ApiUrl}`);
        socket.on("relay_changed", data => setRelays(JSON.parse(data)));
        return () => socket.disconnect();
    });

    useEffect(() => {
        console.log('Relays changed effect!');
        console.log(relays);
    }, [relays]);

    useEffect(() => {
        if(!relayChanged.status) {
            return;
        }

        // const socket = socketIOClient(`${Config.ApiUrl}`);
        // socket.emit('relay_changed', relayChanged);
        // return() => socket.disconnect();

        Axios.post(`${Config.ApiUrl}/relay/${relayChanged.GPIO}/${relayChanged.status}`)
        .catch(error => console.log(error));
    }, [relayChanged]);

    return (<>
        <h1>Relays</h1>
        <div className="relaysContainer">
            {relays.map((relay, index) => (
                <RelayComponent key={index} relay={relay} onToggle={setRelayChanged}/>))}
        </div>
    </>);
});