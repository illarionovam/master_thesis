import { createAsyncThunk } from '@reduxjs/toolkit';
import wrapper from '../wrapper.js';
import {
    getAppUserLocations,
    createAppUserLocation,
    getAppUserLocation,
    updateAppUserLocation,
    destroyAppUserLocation,
    getAppUserLocationPlacements,
    getAppUserLocationPossiblePlacements,
} from '../../api/locations.js';

export const getLocations = createAsyncThunk('locations/getLocations', async (_, { rejectWithValue }) =>
    wrapper(getAppUserLocations, rejectWithValue)()
);

export const createLocation = createAsyncThunk('locations/createLocation', async (payload, { rejectWithValue }) =>
    wrapper(createAppUserLocation, rejectWithValue)(payload)
);

export const getLocation = createAsyncThunk('locations/getLocation', async (id, { rejectWithValue }) =>
    wrapper(getAppUserLocation, rejectWithValue)(id)
);

export const updateLocation = createAsyncThunk('locations/updateLocation', async ({ id, data }, { rejectWithValue }) =>
    wrapper(updateAppUserLocation, rejectWithValue)(id, data)
);

export const deleteLocation = createAsyncThunk('locations/deleteLocation', async (id, { rejectWithValue }) =>
    wrapper(destroyAppUserLocation, rejectWithValue)(id)
);

export const getLocationPlacements = createAsyncThunk(
    'locations/getLocationPlacements',
    async (id, { rejectWithValue }) => wrapper(getAppUserLocationPlacements, rejectWithValue)(id)
);

export const getLocationPossiblePlacements = createAsyncThunk(
    'locations/getLocationPossiblePlacements',
    async (id, { rejectWithValue }) => wrapper(getAppUserLocationPossiblePlacements, rejectWithValue)(id)
);
