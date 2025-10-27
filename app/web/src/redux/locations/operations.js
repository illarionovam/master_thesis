import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppUserLocations } from '../../api/locations.js';
import wrapper from '../wrapper.js';

export const getLocations = createAsyncThunk('characters/getLocations', (_, { rejectWithValue }) => {
    wrapper(getAppUserLocations, rejectWithValue)();
});
