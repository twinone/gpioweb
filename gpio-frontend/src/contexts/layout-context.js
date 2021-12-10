import React from 'react';

const LayoutContext = React.createContext({
    isSidebarVisible: false,
    toggleSidebar: () => {},
    onSidebarToggled: () => {}
});

export default LayoutContext;