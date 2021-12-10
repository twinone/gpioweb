import React from 'react';

const AuthContext = React.createContext({
    isAuthenticated: false,
    userName: '',
    onLoggedIn: () => {},
    onLoggedOut: () => {},
    login: () => {},
    logout: () => {}
});

export default AuthContext;