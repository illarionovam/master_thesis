import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppUser } from '../../api/auth.js';
import wrapper from '../wrapper.js';

export const signUp = createAsyncThunk('auth/signUp', async (payload, { rejectWithValue }) => {
    return wrapper(createAppUser, rejectWithValue)(payload);
});
