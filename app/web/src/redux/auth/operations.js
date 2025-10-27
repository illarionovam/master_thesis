import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    signUpAppUser,
    signInAppUser,
    resetAppUserPassword,
    updateAppUser,
    updateAppUserEmail,
    confirmAppUserEmail,
    confirmAppUserPassword,
    signOutAppUser,
    getAppUserInfo,
} from '../../api/auth.js';
import wrapper from '../wrapper.js';
import { signOutLocal } from './slice.js';

export const signUp = createAsyncThunk('auth/signUp', (payload, { rejectWithValue }) =>
    wrapper(signUpAppUser, rejectWithValue)(payload)
);

export const signIn = createAsyncThunk('auth/signIn', (payload, { rejectWithValue }) =>
    wrapper(signInAppUser, rejectWithValue)(payload)
);

export const resetPassword = createAsyncThunk('auth/resetPassword', (payload, { rejectWithValue }) =>
    wrapper(resetAppUserPassword, rejectWithValue)(payload)
);

export const getUserInfo = createAsyncThunk('auth/getUserInfo', (_, { rejectWithValue }) =>
    wrapper(getAppUserInfo, rejectWithValue)()
);

export const signOut = createAsyncThunk('auth/signOut', (payload, { dispatch, rejectWithValue }) =>
    wrapper(
        signOutAppUser,
        rejectWithValue
    )(payload).finally(() => {
        dispatch(signOutLocal());
    })
);

export const updateUser = createAsyncThunk('auth/updateUser', (payload, { rejectWithValue }) =>
    wrapper(updateAppUser, rejectWithValue)(payload)
);

export const updateUserEmail = createAsyncThunk('auth/updateUserEmail', (payload, { rejectWithValue }) =>
    wrapper(updateAppUserEmail, rejectWithValue)(payload)
);

export const confirmEmail = createAsyncThunk('auth/confirmEmail', (token, { rejectWithValue }) =>
    wrapper(confirmAppUserEmail, rejectWithValue)(token)
);

export const confirmPassword = createAsyncThunk(
    'auth/confirmPassword',
    ({ token, new_password }, { rejectWithValue }) =>
        wrapper(confirmAppUserPassword, rejectWithValue)(token, new_password)
);
