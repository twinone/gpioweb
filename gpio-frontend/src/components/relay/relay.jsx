import React, { useState } from 'react';
import lodash from 'lodash';
import './relay.scss';

export const RelayComponent = function(props) {
    const onToggle = {...props}.onToggle;
    const [relay, setRelay] = useState(props.relay);

    function handleStartStopClick() {
        relay.status = relay.status === 'on' ? 'off' : 'on';
        onToggle && onToggle(relay);
        setRelay(lodash.cloneDeep(relay));
    }

    function getButtonText(status) {
        switch(status) {
            case 'on':
                return 'Turn off';
            default:
                return 'Turn on';
        }
    }

    return(<div className='relay'>
            <div className={'header ' + (relay.status)}>{relay.title}</div>
            <div className='body'>
                <button onClick={handleStartStopClick}>{getButtonText(relay.status)}</button>
            </div>
        </div>)
};