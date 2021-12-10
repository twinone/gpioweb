import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme } from './theme';
import './App.scss';
import ApplicationLayout from './components/layout/application-layout';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ApplicationLayout />
    </ThemeProvider>
  );
}

export default App;
