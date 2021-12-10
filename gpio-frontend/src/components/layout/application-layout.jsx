import React, { useContext, useState } from "react";

import { Container } from "@material-ui/core";
import Storage from "@material-ui/icons/Storage";
import IconButton from "@material-ui/core/IconButton";
import ApplicationSidebar from "./application-sidebar";
import ApplicationBar from "./application-bar";
import { RelaysComponent } from "../relays/relays";
import LayoutContext from "../../contexts/layout-context";
import LayoutProvider from "../../contexts/LayoutProvider";
import AuthProvider from "../../contexts/AuthProvider";
import { Config } from "../../Config";

import classes from "./application-layout.module.scss";

const ApplicationLayout = (props) => {
  const layoutContext = useContext(LayoutContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    layoutContext.isSidebarVisible
  );

  layoutContext.onSidebarToggled = (isSidebarVisible) => {
    setIsSidebarVisible(isSidebarVisible);
  };

  return (
    <AuthProvider>
    <div className={classes.layout}>
      <LayoutProvider>
        <ApplicationSidebar className={`${classes['side-bar']}`} visible={isSidebarVisible}>
        <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => window.open(Config.DbUrl)}
          >
            <Storage />
          </IconButton>
        </ApplicationSidebar>
        <div className={classes.main}>
        <ApplicationBar Title="Control acvariu" />
        <Container maxWidth="md">
          {process.env.API_URL}
          <RelaysComponent />
        </Container>
        </div>
      </LayoutProvider>
    </div>
    </AuthProvider>
  );
};

export default ApplicationLayout;
