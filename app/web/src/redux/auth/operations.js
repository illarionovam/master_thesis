import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    signUpAppUser,
    signInAppUser,
    confirmAppUserEmail,
    confirmAppUserPassword,
    signOutAppUser,
    getAppUserInfo,
} from '../../api/auth.js';
import wrapper from '../wrapper.js';
import { signOutLocal } from './slice.js';

export const signUp = createAsyncThunk('auth/signUp', async (payload, { rejectWithValue }) => {
    return wrapper(signUpAppUser, rejectWithValue)(payload);
});

export const signIn = createAsyncThunk('auth/signIn', async (payload, { rejectWithValue }) => {
    return wrapper(signInAppUser, rejectWithValue)(payload);
});

export const confirmEmail = createAsyncThunk('auth/confirmEmail', async (token, { rejectWithValue }) =>
    wrapper(confirmAppUserEmail, rejectWithValue)(token)
);

export const confirmPassword = createAsyncThunk(
    'auth/confirmPassword',
    async ({ token, new_password }, { rejectWithValue }) =>
        wrapper(args => confirmAppUserPassword(args.token, args.new_password), rejectWithValue)({ token, new_password })
);

export const signOut = createAsyncThunk('auth/signOut', async (payload, { dispatch, rejectWithValue }) =>
    wrapper(
        signOutAppUser,
        rejectWithValue
    )(payload).finally(() => {
        dispatch(signOutLocal());
    })
);

export const getUserInfo = createAsyncThunk('auth/getUserInfo', async (_, { rejectWithValue }) => {
    return wrapper(getAppUserInfo, rejectWithValue)();
});
