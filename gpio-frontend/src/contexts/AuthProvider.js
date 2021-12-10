import React, { useContext } from 'react';
import AuthContext from './auth-context';

const AuthProvider = props => {
    const authContext = useContext(AuthContext);
    return(<AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>);
}

export default AuthProvider;