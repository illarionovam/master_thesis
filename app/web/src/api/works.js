import axiosInstance from './defaults';

export const getAppUserWorks = async () => await axiosInstance.get('/works');

export const createAppUserWork = async payload => await axiosInstance.post('/works', payload);

export const getAppUserWork = async id => await axiosInstance.get(`/works/${id}`);

export const updateAppUserWork = async (id, payload) => await axiosInstance.patch(`/works/${id}`, payload);

export const destroyAppUserWork = async id => await axiosInstance.delete(`/works/${id}`);

export const getAppUserWorkCast = async workId => await axiosInstance.get(`/works/${workId}/cast`);

export const linkAppUserWorkCharacter = async (workId, payload) =>
    await axiosInstance.post(`/works/${workId}/cast`, payload);

export const getAppUserWorkPossibleCast = async workId => await axiosInstance.get(`/works/${workId}/cast/available`);

export const getAppUserCharacterInWork = async (workId, characterInWorkId) =>
    await axiosInstance.get(`/works/${workId}/cast/${characterInWorkId}`);

export const updateAppUserCharacterInWork = async (workId, characterInWorkId, payload) =>
    await axiosInstance.patch(`/works/${workId}/cast/${characterInWorkId}`, payload);

export const destroyAppUserCharacterInWork = async (workId, characterInWorkId) =>
    await axiosInstance.delete(`/works/${workId}/cast/${characterInWorkId}`);

export const getAppUserCharacterInWorkRelationships = async (workId, characterInWorkId) =>
    await axiosInstance.get(`/works/${workId}/cast/${characterInWorkId}/relationships`);

export const getAppUserCharacterInWorkPossibleRelationships = async (workId, characterInWorkId) =>
    await axiosInstance.get(`/works/${workId}/cast/${characterInWorkId}/relationships/available`);

export const createAppUserRelationship = async (workId, characterInWorkId, payload) =>
    await axiosInstance.post(`/works/${workId}/cast/${characterInWorkId}/relationships`, payload);

export const getAppUserRelationship = async (workId, characterInWorkId, relationshipId) =>
    await axiosInstance.get(`/works/${workId}/cast/${characterInWorkId}/relationships/${relationshipId}`);

export const updateAppUserRelationship = async (workId, characterInWorkId, relationshipId, payload) =>
    await axiosInstance.patch(`/works/${workId}/cast/${characterInWorkId}/relationships/${relationshipId}`, payload);

export const destroyAppUserRelationship = async (workId, characterInWorkId, relationshipId) =>
    await axiosInstance.delete(`/works/${workId}/cast/${characterInWorkId}/relationships/${relationshipId}`);

export const getAppUserWorkLocationLinks = async workId => await axiosInstance.get(`/works/${workId}/location-links`);

export const getAppUserWorkPossibleLocationLinks = async workId =>
    await axiosInstance.get(`/works/${workId}/location-links/available`);

export const linkAppUserWorkLocation = async (workId, payload) =>
    await axiosInstance.post(`/works/${workId}/location-links`, payload);

export const getAppUserLocationInWork = async (workId, locationInWorkId) =>
    await axiosInstance.get(`/works/${workId}/location-links/${locationInWorkId}`);

export const updateAppUserLocationInWork = async (workId, locationInWorkId, payload) =>
    await axiosInstance.patch(`/works/${workId}/location-links/${locationInWorkId}`, payload);

export const destroyAppUserLocationInWork = async (workId, locationInWorkId) =>
    await axiosInstance.delete(`/works/${workId}/location-links/${locationInWorkId}`);

export const getAppUserEvents = async workId => await axiosInstance.get(`/works/${workId}/events`);

export const getAppUserEventsByLocationInWorkId = async (workId, locationInWorkId) =>
    await axiosInstance.get(`/works/${workId}/location-links/${locationInWorkId}/events`);

export const getAppUserEventsByCharacterInWorkId = async (workId, characterInWork) =>
    await axiosInstance.get(`/works/${workId}/cast/${characterInWork}/events`);

export const reorderAppUserEvents = async (workId, payload) =>
    await axiosInstance.post(`/works/${workId}/events/reorder`, payload);

export const createAppUserEvent = async (workId, payload) =>
    await axiosInstance.post(`/works/${workId}/events`, payload);

export const getAppUserEvent = async (workId, eventId) => await axiosInstance.get(`/works/${workId}/events/${eventId}`);

export const updateAppUserEvent = async (workId, eventId, payload) =>
    await axiosInstance.patch(`/works/${workId}/events/${eventId}`, payload);

export const destroyAppUserEvent = async (workId, eventId) =>
    await axiosInstance.delete(`/works/${workId}/events/${eventId}`);

export const getAppUserEventParticipants = async (workId, eventId) =>
    await axiosInstance.get(`/works/${workId}/events/${eventId}/participants`);

export const getAppUserEventPossibleParticipants = async (workId, eventId) =>
    await axiosInstance.get(`/works/${workId}/events/${eventId}/participants/available`);

export const linkAppUserEventParticipant = async (workId, eventId, payload) =>
    await axiosInstance.post(`/works/${workId}/events/${eventId}/participants`, payload);

export const unlinkAppUserEventParticipant = async (workId, eventId, eventParticipantId) =>
    await axiosInstance.delete(`/works/${workId}/events/${eventId}/participants/${eventParticipantId}`);
