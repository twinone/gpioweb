import React, { useContext } from "react";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomDialogContext from './custom-dialog-context';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomDialog = (props) => {
  const customDialogContext = useContext(CustomDialogContext);
  const handleClose = (data) => {
    customDialogContext.closeDialog();
    if(data) {
      customDialogContext.submitForm && customDialogContext.submitForm();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth={props.fullWidth || true}
      maxWidth={props.maxWidth || 'md'}
    >
      <DialogTitle>{customDialogContext.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{customDialogContext.text}</DialogContentText>
        {props.children}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <Button onClick={() => handleClose(true)}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
