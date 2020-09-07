import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import { makeStyles } from '@material-ui/core/styles';

import { RelayComponent } from '../relay/relay';
import { Toaster } from '../../shared';
//import { useInterval } from './../../hocs';

const useStyles = makeStyles((theme) => ({
    relaysContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        '& div': {
            margin: '10px',
        }
    }
  }));

export const RelaysComponent = function () {
    const classes = useStyles();

    const apiUrl = process.env.REACT_APP_API_URL;

    const [relays, setRelays] = useState([]);
    const [relayChanged, setRelayChanged] = useState({});
    const [loadRelays, setLoadRelays] = useState(0);

    useEffect(() => {
        console.log(`${apiUrl} loadRelays`);
        Axios.get(`${apiUrl}/relay`)
            .then(response => {
                setRelays(response.data);
            })
            .catch(error => console.log(error));
    }, [loadRelays, apiUrl]);

    useEffect(() => {
        const socket = socketIOClient(`${apiUrl}`);
        socket.on("relay_changed", data => {
            console.log('[SOCKET.IO]: relay_changed');
            
            const newRelays = JSON.parse(data);

            const affectedRelays = [];
            relays.forEach(relay => {
                const newRelay = newRelays.filter(newRelay => newRelay.gpio === relay.gpio)[0];
                if(newRelay) {
                    if(newRelay.status !== relay.status || newRelay.manual !== relay.manual) {
                        affectedRelays.push(newRelay);
                    }
                }
                });

            console.log('Current relays', relays);
            console.log('new relays', newRelays);
            console.log('Affected relays', affectedRelays);

            affectedRelays.forEach(r =>
                Toaster.showInfo(`Relay ${r.title} ${(r.status === 'on' ? 'started': 'stopped')} (Auto : ${r.manual ? 'off': 'on'}).`));

            setRelays(newRelays);
            setLoadRelays(loadRelays + 1);
        });
        return () => socket.disconnect();
    });

    useEffect(() => {
        if(!relayChanged.status) {
            return;
        }

        if(relayChanged.manual) {
            Axios.post(`${apiUrl}/relay/${relayChanged.gpio}/${relayChanged.status}`)
            .catch(error => console.log(error));
        } else {
            Axios.post(`${apiUrl}/relay/${relayChanged.gpio}/auto`)
            .catch(error => console.log(error));            
        }
    }, [relayChanged, apiUrl]);

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
        <div className={classes.relaysContainer}>
            {relays.map((relay, index) => (
                <RelayComponent key={index}
                    relay={relay}
                    onToggle={setRelayChanged} />))}
        </div>
    </>);
};