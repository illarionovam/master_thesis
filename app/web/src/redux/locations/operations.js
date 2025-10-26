import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppUserLocations } from '../../api/locations.js';
import wrapper from '../wrapper.js';

export const getLocations = createAsyncThunk('characters/getLocations', async (_, { rejectWithValue }) => {
    return wrapper(getAppUserLocations, rejectWithValue)();
});
