import axiosInstance from './defaults';

export const createAppUser = async payload => await axiosInstance.post('/auth/sign-up', payload);
