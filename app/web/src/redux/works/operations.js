import { createAsyncThunk } from '@reduxjs/toolkit';
import wrapper from '../wrapper.js';
import {
    getAppUserWorks,
    createAppUserWork,
    getAppUserWork,
    updateAppUserWork,
    destroyAppUserWork,
    getAppUserWorkCast,
    linkAppUserWorkCharacter,
    getAppUserWorkPossibleCast,
    getAppUserCharacterInWork,
    updateAppUserCharacterInWork,
    destroyAppUserCharacterInWork,
    getAppUserCharacterInWorkRelationships,
    getAppUserCharacterInWorkPossibleRelationships,
    createAppUserRelationship,
    getAppUserRelationship,
    updateAppUserRelationship,
    destroyAppUserRelationship,
    getAppUserWorkLocationLinks,
    getAppUserWorkPossibleLocationLinks,
    linkAppUserWorkLocation,
    getAppUserLocationInWork,
    updateAppUserLocationInWork,
    destroyAppUserLocationInWork,
    getAppUserEvents,
    getAppUserEventsByLocationInWorkId,
    createAppUserEvent,
    reorderAppUserEvents,
    getAppUserEvent,
    updateAppUserEvent,
    destroyAppUserEvent,
    getAppUserEventParticipants,
    getAppUserEventPossibleParticipants,
    linkAppUserEventParticipant,
    unlinkAppUserEventParticipant,
    getAppUserEventsByCharacterInWorkId,
    generateAppUserCharacterInWorkImage,
    getAppUserWorkRelationships,
    generateAppUserWorkDescription,
} from '../../api/works.js';

export const getWorks = createAsyncThunk('works/getWorks', async (_, { rejectWithValue }) =>
    wrapper(getAppUserWorks, rejectWithValue)()
);

export const createWork = createAsyncThunk('works/createWork', async (payload, { rejectWithValue }) =>
    wrapper(createAppUserWork, rejectWithValue)(payload)
);

export const generateWorkDescription = createAsyncThunk(
    'works/generateWorkDescription',
    async (id, { rejectWithValue }) => wrapper(generateAppUserWorkDescription, rejectWithValue)(id)
);

export const getWork = createAsyncThunk('works/getWork', async (id, { rejectWithValue }) =>
    wrapper(getAppUserWork, rejectWithValue)(id)
);

export const updateWork = createAsyncThunk('works/updateWork', async ({ id, data }, { rejectWithValue }) =>
    wrapper(updateAppUserWork, rejectWithValue)(id, data)
);

export const deleteWork = createAsyncThunk('works/deleteWork', async (id, { rejectWithValue }) =>
    wrapper(destroyAppUserWork, rejectWithValue)(id)
);

export const getWorkCast = createAsyncThunk('works/getWorkCast', async (workId, { rejectWithValue }) =>
    wrapper(getAppUserWorkCast, rejectWithValue)(workId)
);

export const linkWorkCharacter = createAsyncThunk(
    'works/linkWorkCharacter',
    async ({ workId, data }, { rejectWithValue }) => wrapper(linkAppUserWorkCharacter, rejectWithValue)(workId, data)
);

export const getWorkPossibleCast = createAsyncThunk('works/getWorkPossibleCast', async (workId, { rejectWithValue }) =>
    wrapper(getAppUserWorkPossibleCast, rejectWithValue)(workId)
);

export const getCharacterInWork = createAsyncThunk(
    'works/getCharacterInWork',
    async ({ workId, characterInWorkId }, { rejectWithValue }) =>
        wrapper(getAppUserCharacterInWork, rejectWithValue)(workId, characterInWorkId)
);

export const generateCharacterInWorkImage = createAsyncThunk(
    'works/generateCharacterInWorkImage',
    async ({ workId, characterInWorkId }, { rejectWithValue }) =>
        wrapper(generateAppUserCharacterInWorkImage, rejectWithValue)(workId, characterInWorkId)
);

export const updateCharacterInWork = createAsyncThunk(
    'works/updateCharacterInWork',
    async ({ workId, characterInWorkId, data }, { rejectWithValue }) =>
        wrapper(updateAppUserCharacterInWork, rejectWithValue)(workId, characterInWorkId, data)
);

export const deleteCharacterInWork = createAsyncThunk(
    'works/deleteCharacterInWork',
    async ({ workId, characterInWorkId }, { rejectWithValue }) =>
        wrapper(destroyAppUserCharacterInWork, rejectWithValue)(workId, characterInWorkId)
);

export const getCharacterInWorkRelationships = createAsyncThunk(
    'works/getCharacterInWorkRelationships',
    async ({ workId, characterInWorkId }, { rejectWithValue }) =>
        wrapper(getAppUserCharacterInWorkRelationships, rejectWithValue)(workId, characterInWorkId)
);

export const getWorkRelationships = createAsyncThunk(
    'works/getWorkRelationships',
    async (workId, { rejectWithValue }) => wrapper(getAppUserWorkRelationships, rejectWithValue)(workId)
);

export const getCharacterInWorkPossibleRelationships = createAsyncThunk(
    'works/getCharacterInWorkPossibleRelationships',
    async ({ workId, characterInWorkId }, { rejectWithValue }) =>
        wrapper(getAppUserCharacterInWorkPossibleRelationships, rejectWithValue)(workId, characterInWorkId)
);

export const createRelationship = createAsyncThunk(
    'works/createRelationship',
    async ({ workId, characterInWorkId, data }, { rejectWithValue }) =>
        wrapper(createAppUserRelationship, rejectWithValue)(workId, characterInWorkId, data)
);

export const getRelationship = createAsyncThunk(
    'works/getRelationship',
    async ({ workId, characterInWorkId, relationshipId }, { rejectWithValue }) =>
        wrapper(getAppUserRelationship, rejectWithValue)(workId, characterInWorkId, relationshipId)
);

export const updateRelationship = createAsyncThunk(
    'works/updateRelationship',
    async ({ workId, characterInWorkId, relationshipId, data }, { rejectWithValue }) =>
        wrapper(updateAppUserRelationship, rejectWithValue)(workId, characterInWorkId, relationshipId, data)
);

export const deleteRelationship = createAsyncThunk(
    'works/deleteRelationship',
    async ({ workId, characterInWorkId, relationshipId }, { rejectWithValue }) =>
        wrapper(destroyAppUserRelationship, rejectWithValue)(workId, characterInWorkId, relationshipId)
);

export const getWorkLocationLinks = createAsyncThunk(
    'works/getWorkLocationLinks',
    async (workId, { rejectWithValue }) => wrapper(getAppUserWorkLocationLinks, rejectWithValue)(workId)
);

export const getWorkPossibleLocationLinks = createAsyncThunk(
    'works/getWorkPossibleLocationLinks',
    async (workId, { rejectWithValue }) => wrapper(getAppUserWorkPossibleLocationLinks, rejectWithValue)(workId)
);

export const linkWorkLocation = createAsyncThunk(
    'works/linkWorkLocation',
    async ({ workId, data }, { rejectWithValue }) => wrapper(linkAppUserWorkLocation, rejectWithValue)(workId, data)
);

export const getLocationInWork = createAsyncThunk(
    'works/getLocationInWork',
    async ({ workId, locationInWorkId }, { rejectWithValue }) =>
        wrapper(getAppUserLocationInWork, rejectWithValue)(workId, locationInWorkId)
);

export const updateLocationInWork = createAsyncThunk(
    'works/updateLocationInWork',
    async ({ workId, locationInWorkId, data }, { rejectWithValue }) =>
        wrapper(updateAppUserLocationInWork, rejectWithValue)(workId, locationInWorkId, data)
);

export const deleteLocationInWork = createAsyncThunk(
    'works/deleteLocationInWork',
    async ({ workId, locationInWorkId }, { rejectWithValue }) =>
        wrapper(destroyAppUserLocationInWork, rejectWithValue)(workId, locationInWorkId)
);

export const getEvents = createAsyncThunk('works/getEvents', async (workId, { rejectWithValue }) =>
    wrapper(getAppUserEvents, rejectWithValue)(workId)
);

export const getEventsByLocationInWorkId = createAsyncThunk(
    'works/getEventsByLocationInWorkId',
    async ({ workId, locationInWorkId }, { rejectWithValue }) =>
        wrapper(getAppUserEventsByLocationInWorkId, rejectWithValue)(workId, locationInWorkId)
);

export const getEventsByCharacterInWorkId = createAsyncThunk(
    'works/getEventsByCharacterInWorkId',
    async ({ workId, characterInWorkId }, { rejectWithValue }) =>
        wrapper(getAppUserEventsByCharacterInWorkId, rejectWithValue)(workId, characterInWorkId)
);

export const reorderEvents = createAsyncThunk(
    'works/reorderAppUserEvents',
    async ({ workId, data }, { rejectWithValue }) => wrapper(reorderAppUserEvents, rejectWithValue)(workId, data)
);

export const createEvent = createAsyncThunk('works/createEvent', async ({ workId, data }, { rejectWithValue }) =>
    wrapper(createAppUserEvent, rejectWithValue)(workId, data)
);

export const getEvent = createAsyncThunk('works/getEvent', async ({ workId, eventId }, { rejectWithValue }) =>
    wrapper(getAppUserEvent, rejectWithValue)(workId, eventId)
);

export const updateEvent = createAsyncThunk(
    'works/updateEvent',
    async ({ workId, eventId, data }, { rejectWithValue }) =>
        wrapper(updateAppUserEvent, rejectWithValue)(workId, eventId, data)
);

export const deleteEvent = createAsyncThunk('works/deleteEvent', async ({ workId, eventId }, { rejectWithValue }) =>
    wrapper(destroyAppUserEvent, rejectWithValue)(workId, eventId)
);

export const getEventParticipants = createAsyncThunk(
    'works/getEventParticipants',
    async ({ workId, eventId }, { rejectWithValue }) =>
        wrapper(getAppUserEventParticipants, rejectWithValue)(workId, eventId)
);

export const getEventPossibleParticipants = createAsyncThunk(
    'works/getEventPossibleParticipants',
    async ({ workId, eventId }, { rejectWithValue }) =>
        wrapper(getAppUserEventPossibleParticipants, rejectWithValue)(workId, eventId)
);

export const linkEventParticipant = createAsyncThunk(
    'works/linkEventParticipant',
    async ({ workId, eventId, data }, { rejectWithValue }) =>
        wrapper(linkAppUserEventParticipant, rejectWithValue)(workId, eventId, data)
);

export const unlinkEventParticipant = createAsyncThunk(
    'works/unlinkEventParticipant',
    async ({ workId, eventId, eventParticipantId }, { rejectWithValue }) =>
        wrapper(unlinkAppUserEventParticipant, rejectWithValue)(workId, eventId, eventParticipantId)
);
