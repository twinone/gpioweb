import { toast } from 'react-toastify';

toast.configure();

const toasterOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: false,
    };

export const Toaster = {
    showInfo: (message) => {
        toast.info(message, toasterOptions);
    },
    showError: (message) => {
        toast.error(message, toasterOptions)
    }      
}
