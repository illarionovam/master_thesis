import axiosInstance from './defaults';

export const getAppUserCharacters = async () => await axiosInstance.get('/characters');

export const createAppUserCharacter = async payload => await axiosInstance.post('/characters', payload);

export const getAppUserCharacter = async id => await axiosInstance.get(`/characters/${id}`);

export const updateAppUserCharacter = async (id, payload) => await axiosInstance.patch(`/characters/${id}`, payload);

export const destroyAppUserCharacter = async id => await axiosInstance.delete(`/characters/${id}`);

export const getAppUserCharacterAppearances = async (id, params) =>
    await axiosInstance.get(`/characters/${id}/appearances`, { params });

export const getAppUserCharacterPossibleAppearances = async (id, params) =>
    await axiosInstance.get(`/characters/${id}/appearances/available`, { params });
