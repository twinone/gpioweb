//import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const prefersDarkMode = true; //useMediaQuery('(prefers-color-scheme: dark)');

const theme = createMuiTheme({
    palette: {
        type: prefersDarkMode ? 'dark' : 'light',
        // primary: {
        //     main: purple[500],
        // },
        // secondary: {
        //     main: green[500],
        // }
    }
});

export const Theme = responsiveFontSizes(theme);