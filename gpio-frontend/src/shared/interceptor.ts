import Axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

const UNAUTHORIZED: number = 401;
const BADREQUEST: number = 400;
const SERVERERROR: number = 500;

class Interceptor {
    setupRequestInterceptor = () => {
        Axios.interceptors.request.use((request: AxiosRequestConfig) => {
            console.log('Intercepted request');
            console.log(request);
            console.log(`Method: ${request.method}`);
            return request;
        }, (error): any => {
            return Promise.reject(error);
        });
    };

    setupResponseInterceptor = () => {
        Axios.interceptors.response.use((response: any): any => {
            console.log('Intercepted response');
            console.log(response);
            return response;
        }, (error): any => {
            // Do something with response error
            if (error && error.response) {
                console.error(error.response);
                toast.error(`Error: ${error.response.status} ${error.response.data}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                switch (error.response.status) {
                    case UNAUTHORIZED:
                        break;
                    case BADREQUEST:
                        break;
                    case SERVERERROR:
                        break;
                    default:
                        break;
                }
            }
            return Promise.reject(error);
        });
    };
}

const interceptor = new Interceptor();
interceptor.setupRequestInterceptor();
interceptor.setupResponseInterceptor();
console.log('Interceptor configured.');