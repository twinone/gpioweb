import { useContext, useState } from "react";
import CustomDialogContext from "./custom-dialog-context";
import CustomDialog from "./CustomDialog";

const CustomDialogProvider = (props) => {
  const customDialogContext = useContext(CustomDialogContext);
  const [isOpen, setIsOpen] = useState(false);

  customDialogContext.openDialog = () => {
      setIsOpen(true);
  }

  customDialogContext.closeDialog = () => {
      setIsOpen(false);
  }

  return (
    <CustomDialogContext.Provider value={customDialogContext}>
      <CustomDialog
        open={isOpen}
        title={customDialogContext.title}
        text={customDialogContext.text}
        handleClose={customDialogContext.handleClose}
      >{customDialogContext.dialogContent}</CustomDialog>
      {props.children}
    </CustomDialogContext.Provider>
  );
};

export default CustomDialogProvider;
