import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme } from './theme';
import './App.scss';
import ApplicationLayout from './components/layout/application-layout';

function App() {
  return (
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ApplicationLayout />
    </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
