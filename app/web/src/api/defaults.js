import axios from 'axios';
import { store } from '../redux/store.js';
import { signOutLocal } from '../redux/auth/slice.js';

const baseURL = '/api';

const axiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        } else if (config.headers?.Authorization) {
            delete config.headers.Authorization;
        }

        return config;
    },
    error => Promise.reject(error)
);

let isHandling401 = false;

axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
        const status = error?.response?.status;

        if (status === 401 && !isHandling401) {
            isHandling401 = true;
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                store?.dispatch?.(signOutLocal());
            } finally {
                setTimeout(() => {
                    isHandling401 = false;
                }, 0);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
