import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppUserWorks } from '../../api/works.js';
import wrapper from '../wrapper.js';

export const getWorks = createAsyncThunk('works/getWorks', async (_, { rejectWithValue }) =>
    wrapper(getAppUserWorks, rejectWithValue)()
);
