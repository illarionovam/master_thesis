import { createSlice } from '@reduxjs/toolkit';
import { signIn, signUp, confirmEmail, confirmPassword } from './operations';

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
    confirmEmail: { loading: false, error: null, success: false },
    confirmPassword: { loading: false, error: null, success: false },
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
            })
            .addCase(confirmEmail.pending, state => {
                state.confirmEmail.loading = true;
                state.confirmEmail.error = null;
                state.confirmEmail.success = false;
            })
            .addCase(confirmEmail.fulfilled, state => {
                state.confirmEmail.loading = false;
                state.confirmEmail.success = true;
            })
            .addCase(confirmEmail.rejected, (state, action) => {
                state.confirmEmail.loading = false;
                state.confirmEmail.error = action.payload;
            })
            .addCase(confirmPassword.pending, state => {
                state.confirmPassword.loading = true;
                state.confirmPassword.error = null;
                state.confirmPassword.success = false;
            })
            .addCase(confirmPassword.fulfilled, state => {
                state.confirmPassword.loading = false;
                state.confirmPassword.success = true;
            })
            .addCase(confirmPassword.rejected, (state, action) => {
                state.confirmPassword.loading = false;
                state.confirmPassword.error = action.payload;
            });
    },
});

export const { resetSignUp, resetSignIn, signOut } = authSlice.actions;
export default authSlice.reducer;
