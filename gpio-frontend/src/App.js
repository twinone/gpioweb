import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container, Button } from '@material-ui/core';
import { RelaysComponent } from './components/relays/relays';
import { Config } from './Config';
import { Theme } from './theme';
import { MyBottomNavigation } from './components/layout/bottom-navigation';
import ButtonAppBar from './components/layout/application-bar';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ButtonAppBar Title='Relays'/>
      <Container maxWidth="sm">
        <RelaysComponent />
        <Button variant="contained" color="primary" onClick={() => window.open(Config.DbUrl)}>
          Db
        </Button>
        <MyBottomNavigation />
      </Container>
    </ThemeProvider>
  );
}

export default App;
