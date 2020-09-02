import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';
import { RelaysComponent } from './components/relays/relays';
import { Theme } from './theme';
import { MyBottomNavigation } from './components/layout/bottom-navigation';
import ButtonAppBar from './components/layout/application-bar';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ButtonAppBar Title='Relays'/>
      <Container maxWidth="md">
        {process.env.API_URL}
        <RelaysComponent />
        <MyBottomNavigation />
      </Container>
    </ThemeProvider>
  );
}

export default App;
