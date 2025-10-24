import axios from 'axios';

const baseURL = '/api';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error)
);

export default axiosInstance;
