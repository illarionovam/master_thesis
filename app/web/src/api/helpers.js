import axiosInstance from './defaults';

export const uploadImage = async fd =>
    await axiosInstance.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
