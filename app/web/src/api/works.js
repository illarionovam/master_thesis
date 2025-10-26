import axiosInstance from './defaults';

export const getAppUserWorks = async () => await axiosInstance.get('/works');
