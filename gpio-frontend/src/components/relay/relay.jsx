import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import './relay.scss';
import { Config } from './../../Config';

const relayStatuses=[
    {status: 'on', text:'Turn off'},
    {status: 'off', text: 'Turn on'}
]

export const RelayComponent = function(props) {
    var relay = {...props}.relay;
    const [relayStatus, setRelayStatus] = useState(relay["direction"] === 1 ? relayStatuses[1] : relayStatuses[0]);

    function setGpio(pin, value) {
        Axios.get(`${Config.ApiUrl}/relay/${relay.GPIO}/${value}`)
            .then(response => console.log(response))
            .catch(error => {
                console.log(error);
            });
    }

    function handleStartStopClick() {
        if(relayStatus.status === 'off') {
            setRelayStatus(relayStatuses.find(x => x.status === 'on'));
            setGpio(relay.GPIO, 'on');
        } else if(relayStatus.status === 'on') {
            setRelayStatus(relayStatuses.find(x => x.status === 'off'));
            setGpio(relay.GPIO, 'off');
        }
        
    }

    return(<div className='relay'>
        <div className={'header ' + (relayStatus.status === 'on' ? 'on' : 'off')}>{relay.GPIO}</div>
        <div className='body'>
            <button onClick={handleStartStopClick}>{relayStatus.text}</button>
        </div>
        </div>)
}