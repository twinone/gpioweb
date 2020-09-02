//import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import PouchDB from 'pouchdb';

var theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: green[500],
        }
    }
});

var db = new PouchDB('theme');

db.get("theme")
.then(res => {
    console.log(res);
    theme = createMuiTheme({
        palette: {
            type: res.prefersDarkMode,
            primary: {
                main: blue[500],
            },
            secondary: {
                main: green[500],
            }
        }
    });
});

// db.put({
//     _id: 'theme',
//     prefersDarkMode: true
// }, (err, result) => {
//     if (!err) {
//         console.log('Successfully saved theme!');
//     }
// });



export const Theme = responsiveFontSizes(theme);