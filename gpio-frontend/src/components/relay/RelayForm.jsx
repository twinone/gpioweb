import { useContext, useState } from "react";
import TextField from "@material-ui/core/TextField";
import CustomDialogContext from "../../UI/custom-dialog-context";
import classes from "./RelayForm.module.scss";

const RelayForm = (props) => {
  const customDialogContext = useContext(CustomDialogContext);

  const [formData, setFormData] = useState({
    name: props.data?.title || "",
    gpio: props.data?.gpio ? props.data.gpio.toString() : "0",
  });

  customDialogContext.submitForm = () => {
    customDialogContext.data = formData;
    customDialogContext.onSubmit && customDialogContext.onSubmit(formData);
  };

  const denumireChangeHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      name: event.target.value,
    }));
  };

  const gpioChangeHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      gpio: event.target.value,
    }));
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <TextField
        id="relay_name_input"
        label="Denumire"
        variant="standard"
        value={formData.name}
        onChange={denumireChangeHandler}
      />
      <TextField
        type="number"
        id="relay_gpio_input"
        label="GPIO"
        variant="standard"
        value={formData.gpio}
        onChange={gpioChangeHandler}
      />
    </form>
  );
};

export default RelayForm;
