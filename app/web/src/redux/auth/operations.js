import { createAsyncThunk } from '@reduxjs/toolkit';
import { signUpAppUser, signInAppUser } from '../../api/auth.js';
import wrapper from '../wrapper.js';

export const signUp = createAsyncThunk('auth/signUp', async (payload, { rejectWithValue }) => {
    return wrapper(signUpAppUser, rejectWithValue)(payload);
});

export const signIn = createAsyncThunk('auth/signIn', async (payload, { rejectWithValue }) => {
    return wrapper(signInAppUser, rejectWithValue)(payload);
});
