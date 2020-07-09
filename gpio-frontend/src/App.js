import React from 'react';
import './App.css';
import { Config } from './Config';
import { RelayComponent } from './components/relay/relay';
import { RelaysComponent } from './components/relays/relays';

function App() {
  const apiUrl = Config.ApiUrl;
  return (
<>
  <div>
    <RelaysComponent />
  </div>
</>
  );
}

export default App;
