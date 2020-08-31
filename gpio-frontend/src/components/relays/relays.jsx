import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import './relays.scss';

import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';
import { useInterval } from './../../hocs';

export const RelaysComponent = function () {
    const [relays, setRelays] = useState([]);
    const [relayChanged, setRelayChanged] = useState({});

    useEffect(() => {
        Axios.get(`${Config.ApiUrl}/relay`)
            .then(response => {
                setRelays(response.data);
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

        if(relayChanged.manual) {
            Axios.post(`${Config.ApiUrl}/relay/${relayChanged.gpio}/${relayChanged.status}`)
            .catch(error => console.log(error));
        } else {
            Axios.post(`${Config.ApiUrl}/relay/${relayChanged.gpio}/auto`)
            .catch(error => console.log(error));            
        }
    }, [relayChanged]);

    // useInterval(async () => {
    //     try {
    //     var response = await Axios.get(`${Config.ApiUrl}/relay`);
    //     console.log(response.data);
    //     //setRelays(response.data);
    //     } catch(error) {
    //         console.error(error);
    //     }
    // }, 5000, [setRelays]);

    return (<>
        <h1>Relays</h1>
        <div className="relaysContainer">
            {relays.map((relay, index) => (
                <RelayComponent key={index} relay={relay} onToggle={setRelayChanged}/>))}
        </div>
    </>);
};