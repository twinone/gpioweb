import { toast } from 'react-toastify';

toast.configure();

export const Toaster = {
    showInfo: function showInfo(message) {
        console.log(message);
        toast.info(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    },
    showEror: function showError(message) {
        console.error(message);
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            })
    }      
}
