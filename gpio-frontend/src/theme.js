//import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import orange from '@material-ui/core/colors/orange';

var theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: purple[500],
        },
        success: {
            main: green[500],
        },
        error: {
            main: red[500],
        },
        warning: {
            main: orange[500],
        },
    }
});

export const Theme = responsiveFontSizes(theme);