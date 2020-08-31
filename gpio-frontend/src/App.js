import React from 'react';
import './App.css';
import { RelaysComponent } from './components/relays/relays';
import { Config } from './Config';

function App() {
  return (
<>
  <div>
    <RelaysComponent />
    <button onClick={() => window.open(Config.DbUrl)}>Db</button>
  </div>
</>
  );
}

export default App;
