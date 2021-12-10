import React, { useContext } from "react";
import LayoutContext from "./layout-context";

const LayoutProvider = props => {
    const layoutContext = useContext(LayoutContext);

    layoutContext.toggleSidebar = () => {
        layoutContext.isSidebarVisible = !layoutContext.isSidebarVisible;
        layoutContext.onSidebarToggled && layoutContext.onSidebarToggled(layoutContext.isSidebarVisible);
    }

    return <LayoutContext.Provider value={layoutContext}>{props.children}</LayoutContext.Provider>
}

export default LayoutProvider;