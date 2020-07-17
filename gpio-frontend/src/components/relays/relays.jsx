import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import lodash from 'lodash';
import './relays.scss';
import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';
import { Relay } from '../../modules/relay';
import socketIOClient from "socket.io-client";
import { RelayDirections } from './../../modules/relay';

export const RelaysComponent = function () {
    const [relays, setRelays] = useState([]);

    const [message, setMessage] = useState({});

    useEffect(() => {
        const socket = socketIOClient(`${Config.ApiUrl}`);
        
        socket.on('connect', function () {
            socket.emit('my event', {
                data: 'User Connected'
            })
        });
    
        socket.on("API event", data => {
            setMessage(JSON.parse(data));
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        Axios.get(`${Config.ApiUrl}/status`)
            .then(response => {
                setRelays(response.data.devs
                    .map(relay => new Relay(relay.GPIO, relay.value, relay.direction, relay.title)));
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() =>{
        // relays.forEach(r => {
        //     if(r.GPIO === message.GPIO) {
        //         r.direction = message.direction;
        //         r.value = r.direction === RelayDirections.IN ? 1: 0;
        //     }
        // });
        // setRelays(lodash.cloneDeep(relays));
        console.log(message);
        Axios.get(`${Config.ApiUrl}/status`)
        .then(response => {
            console.log(response);
            setRelays(response.data.devs
                .map(relay => new Relay(relay.GPIO, relay.value, relay.direction, relay.title)));
        })
        .catch(error => console.log(error));
    }, [message]);

    return (<>
        <h1>Relays</h1>
        <div className="relaysContainer">
            {relays.map((relay, index) => (
                <RelayComponent key={index}
                    relay={relay} />))}
        </div>
    </>);
}