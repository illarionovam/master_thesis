import axiosInstance from './defaults';

export const getAppUserLocations = async () => await axiosInstance.get('/locations');
