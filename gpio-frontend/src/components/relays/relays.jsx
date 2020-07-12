import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import lodash from 'lodash';
import './relays.scss';
import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';
import { Relay } from '../../modules/relay';
import socketIOClient from "socket.io-client";

export const RelaysComponent = function () {
    const [relays, setRelays] = useState([]);

    const [response, setResponse] = useState("");

    useEffect(() => {
        const socket = socketIOClient(`${Config.ApiUrl}`);
        
        socket.on('connect', function () {
            socket.emit('my event', {
                data: 'User Connected'
            })
        });
    
        socket.on("API event", data => {
            console.log(`Websockets event received!`);
            console.log(data);
            setResponse(data);
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        Axios.get(`${Config.ApiUrl}/status`)
            .then(response => {
                setRelays(response.data.devs);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() =>{
        console.log('Response effect!');
        relays.forEach(r => {
            if(r.GPIO === response.GPIO) {
                r.value = response.value;
                r.direction = response.direction
            }
        });
        setRelays(lodash.cloneDeep(relays));
    }, [response]);
    return (<>
        <h1>Relays</h1>
        <div className="relaysContainer">
            {relays.map((relay, index) => (
                <RelayComponent key={index}
                    relay={new Relay(relay.GPIO, relay.value, relay.direction, relay.title)} />))}
        </div>
    </>);
}