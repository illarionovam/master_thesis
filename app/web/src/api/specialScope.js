import axios from 'axios';

const baseURL = '/api';

const axiosInstanceWithSpecialScope = token => {
    const client = axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' },
    });

    client.interceptors.request.use(
        config => {
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

    client.interceptors.response.use(
        response => response.data,
        error => Promise.reject(error)
    );

    return client;
};

export default axiosInstanceWithSpecialScope;
