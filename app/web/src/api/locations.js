import axiosInstance from './defaults';

export const getAppUserLocations = async () => await axiosInstance.get('/locations');

export const createAppUserLocation = async payload => await axiosInstance.post('/locations', payload);

export const getAppUserLocation = async id => await axiosInstance.get(`/locations/${id}`);

export const updateAppUserLocation = async (id, payload) => await axiosInstance.patch(`/locations/${id}`, payload);

export const destroyAppUserLocation = async id => await axiosInstance.delete(`/locations/${id}`);

export const getAppUserLocationPlacements = async (id, params) =>
    await axiosInstance.get(`/locations/${id}/placements`, { params });

export const getAppUserLocationPossiblePlacements = async (id, params) =>
    await axiosInstance.get(`/locations/${id}/placements/available`, { params });
