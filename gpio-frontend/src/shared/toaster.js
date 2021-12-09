import { toast } from 'react-toastify';

toast.configure();

const toasterOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    };

export const Toaster = {
    showInfo: (message) => {
        toast.info(message, toasterOptions);
    },
    showError: (message) => {
        toast.error(message, toasterOptions)
    }      
}
