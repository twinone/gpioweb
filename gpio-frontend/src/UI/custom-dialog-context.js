import React from 'react';

const CustomDialogContext = React.createContext({
    open: false,
    title: '',
    text: '',
    dialogContent: '',
    handleClose: (data) => {},
    openDialog: () => {},
    closeDialog: () => {}
});

export default CustomDialogContext;