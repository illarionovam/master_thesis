import { createSlice } from '@reduxjs/toolkit';
import { signIn, signUp } from './operations';

const initialState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    signUp: {
        loading: false,
        error: null,
        result: null,
    },
    signIn: {
        loading: false,
        error: null,
        result: null,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetSignUp(state) {
            state.signUp.loading = false;
            state.signUp.error = null;
            state.signUp.result = null;
        },
        resetSignIn(state) {
            state.signIn.loading = false;
            state.signIn.error = null;
            state.signIn.result = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(signUp.pending, state => {
                state.signUp.loading = true;
                state.signUp.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.signUp.loading = false;
                state.signUp.result = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.signUp.loading = false;
                state.signUp.error = action.payload;
            })
            .addCase(signIn.pending, state => {
                state.signIn.loading = true;
                state.signIn.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.signIn.loading = false;
                state.signIn.result = action.payload;

                const { token, ...user } = action.payload;
                state.token = token;
                state.user = user;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                }
            })
            .addCase(signIn.rejected, (state, action) => {
                state.signIn.loading = false;
                state.signIn.error = action.payload;

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }

                state.token = null;
                state.user = null;
            });
    },
});

export const { resetSignUp, resetSignIn, signOut } = authSlice.actions;
export default authSlice.reducer;
