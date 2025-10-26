import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppUserWorks } from '../../api/works.js';
import wrapper from '../wrapper.js';

export const getWorks = createAsyncThunk('characters/getWorks', async (_, { rejectWithValue }) => {
    return wrapper(getAppUserWorks, rejectWithValue)();
});
