import axiosInstance from './defaults';

export const getAppUserCharacters = async () => await axiosInstance.get('/characters');
