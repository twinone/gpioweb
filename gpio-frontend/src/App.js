import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';
import { RelaysComponent } from './components/relays/relays';
import { Theme } from './theme';
import './App.scss';
import ButtonAppBar from './components/layout/application-bar';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ButtonAppBar Title='Relays'/>
      <Container maxWidth="md">
        {process.env.API_URL}
        <RelaysComponent />
      </Container>
    </ThemeProvider>
  );
}

export default App;
