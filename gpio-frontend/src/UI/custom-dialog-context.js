import React from 'react';

const CustomDialogContext = React.createContext({
    open: false,
    title: '',
    text: '',
    dialogContent: '',
    data: '',
    submitForm: () => {},
    onSubmit: (data) => {},
    openDialog: () => {},
    closeDialog: () => {}
});

export default CustomDialogContext;