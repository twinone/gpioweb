//import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const prefersDarkMode = false; //useMediaQuery('(prefers-color-scheme: dark)');

const theme = createMuiTheme({
    palette: {
        type: prefersDarkMode ? 'dark' : 'light',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: green[500],
        }
    }
});

export const Theme = responsiveFontSizes(theme);