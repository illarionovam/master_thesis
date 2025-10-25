import axiosInstance from './defaults';

export const signUpAppUser = async payload => await axiosInstance.post('/auth/sign-up', payload);
export const signInAppUser = async payload => await axiosInstance.post('/auth/sign-in', payload);
