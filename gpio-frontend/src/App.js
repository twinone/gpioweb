import React from 'react';
import './App.css';
import { Config } from './Config';
import { RelayComponent } from './components/relay/relay';

function App() {
  const apiUrl = Config.ApiUrl;
  return (
<>
  <p>{`api url: ${apiUrl}`}</p>
  <div>
    <RelayComponent relay={{GPIO: 40, direction: 1, value: 0}}/>
  </div>
</>
  );
}

export default App;
