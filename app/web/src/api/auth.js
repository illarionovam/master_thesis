import axiosInstance from './defaults';
import axiosInstanceWithSpecialScope from './specialScope';

export const signUpAppUser = async payload => await axiosInstance.post('/auth/sign-up', payload);

export const signInAppUser = async payload => await axiosInstance.post('/auth/sign-in', payload);

export const verifyAppUserEmail = async payload => await axiosInstance.post('/auth/verify', payload);

export const resetAppUserPassword = async payload => await axiosInstance.post('/auth/forgot-password', payload);

export const getAppUserInfo = async () => await axiosInstance.get('/auth/user-info');

export const signOutAppUser = async payload => await axiosInstance.post('/auth/sign-out', payload);

export const updateAppUser = async payload => await axiosInstance.post('/auth/update', payload);

export const updateAppUserEmail = async payload => await axiosInstance.post('/auth/update-email', payload);

export const confirmAppUserEmail = async token =>
    await axiosInstanceWithSpecialScope(token).post('/auth/confirm-email', {});

export const confirmAppUserPassword = async (token, new_password) =>
    await axiosInstanceWithSpecialScope(token).post('/auth/confirm-password', { new_password });
