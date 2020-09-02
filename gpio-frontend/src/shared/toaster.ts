import { toast } from 'react-toastify';

export type IToaster = {
    showInfo(message: string): void;
    showError (message: string): void;
}

export class Toaster implements IToaster {
    public showInfo(message: string): void {
        toast.info(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }
    
    public showError (message: string): void {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }
}