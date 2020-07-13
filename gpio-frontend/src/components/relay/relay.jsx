import React, { useState, useEffect  } from 'react'
import Axios from 'axios';
import lodash from 'lodash';


import './relay.scss';
import { Config } from './../../Config';

export const RelayComponent = function(props) {

    const onStatusChanged = {...props}.onStatusChanged;

    const [relay, setRelay] = useState({...props}.relay);

    function setGpio(pin, value) {
        Axios.get(`${Config.ApiUrl}/relay/${relay.GPIO}/${value}`)
            .then(response => {})
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        console.log('Relay changed');
    }, [relay])

    function handleStartStopClick() {
        relay.toggle();
        onStatusChanged && onStatusChanged(relay.getStatus().status);
        setRelay(lodash.cloneDeep(relay));
        setGpio(relay.GPIO, relay.getStatus().status);
    }

    return(<div className='relay'>
        <div className={'header ' + (relay.getStatus().status === 'on' ? 'on' : 'off')}>{relay.GPIO}</div>
        <div className='body'>
            <button onClick={handleStartStopClick}>{relay.getStatus().text}</button>
        </div>
        </div>)
}