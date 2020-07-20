import React, { useState, useCallback } from 'react';

export const withForceUpdate = Component => props => {
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => {
        console.log('Force Update');
        updateState({});
    },[]);
    return (<Component {...props}/>);
}