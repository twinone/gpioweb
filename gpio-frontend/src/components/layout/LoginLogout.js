import { useContext, useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { makeStyles } from "@material-ui/core/styles";
import AuthContext from "../../contexts/auth-context";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const LoginLogout = (props) => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(authContext.isAuthenticated);

  authContext.onLoggedIn = () => setIsAuthenticated(true);
  authContext.onLoggedOut = () => setIsAuthenticated(false);
  
  const loginClickHandler = () => {
    authContext.login && authContext.login();
  }

  const logoutClickHandler = () => {
    authContext.logout && authContext.logout();
  }

  const loginContent = (
    <IconButton
      className={classes.menuButton}
      color="inherit"
      aria-label="login"
      onClick={logoutClickHandler}
    >
      <PersonIcon />
    </IconButton>
  );

  const logoutContent = (
    <IconButton
      className={classes.menuButton}
      color="inherit"
      aria-label="logout"
      onClick={loginClickHandler}
    >
      <LogoutIcon />
    </IconButton>
  );

  return <>{isAuthenticated ? logoutContent : loginContent}</>;
};

export default LoginLogout;
