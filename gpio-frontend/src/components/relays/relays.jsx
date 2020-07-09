import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import './relays.scss'
import { Config } from './../../Config';
import { RelayComponent } from '../relay/relay';

export const RelaysComponent = function() {

    const [relays, setRelays] = useState([]);

    useEffect( () => {
        Axios.get(`${Config.ApiUrl}/status`)
        .then(response => {
            console.log(response);
            setRelays(response.data.devs);
        })
        .catch(error => console.log(error));
      }, []);

    return(<>
    <h1>Relays</h1>
    <div className="relaysContainer">
        {relays.map( (relay, index) => (<RelayComponent key={index} relay={relay} />))}
    </div>
    </>);
}