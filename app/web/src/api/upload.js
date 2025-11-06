import axiosInstance from './defaults';

export const uploadImage = async payload =>
    await axiosInstance.post('/upload', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
