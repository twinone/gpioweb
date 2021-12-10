import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from '@mui/icons-material/Person';
import LayoutContext from '../../contexts/layout-context';
import LoginLogout from "./LoginLogout";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ApplicationBar(props) {
  const classes = useStyles();
  const layoutContext = useContext(LayoutContext);

  const menuClickHandler = () => {
    layoutContext.toggleSidebar();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={menuClickHandler}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.Title}
          </Typography>
          <LoginLogout isLoggedIn={false} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
