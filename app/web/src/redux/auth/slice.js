import { createSlice } from '@reduxjs/toolkit';
import {
    signIn,
    signUp,
    resetPassword,
    getUserInfo,
    updateUser,
    updateUserEmail,
    confirmEmail,
    confirmPassword,
} from './operations';

const op = { loading: false, error: null };

const initialState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,

    signUp: { ...op, success: false },
    signIn: { ...op, result: null },
    resetPassword: { ...op, success: false },
    getUserInfo: { ...op },
    updateUser: { ...op },
    updateUserEmail: { ...op, success: false },
    confirmEmail: { ...op, success: false },
    confirmPassword: { ...op, success: false },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetSignUp(state) {
            state.signUp.loading = false;
            state.signUp.error = null;
            state.signUp.success = false;
        },
        resetSignIn(state) {
            state.signIn.loading = false;
            state.signIn.error = null;
            state.signIn.result = null;
        },
        resetChangePassword(state) {
            state.updateUser.loading = false;
            state.updateUser.error = null;
        },
        signOutLocal(state) {
            state.token = null;
            state.user = null;
            state.signIn.result = null;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(signUp.pending, state => {
                state.signUp.loading = true;
                state.signUp.error = null;
            })
            .addCase(signUp.fulfilled, state => {
                state.signUp.loading = false;
                state.signUp.success = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.signUp.loading = false;
                state.signUp.error = action.payload;
            });
        builder
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

                state.token = null;
                state.user = null;
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            });
        builder
            .addCase(resetPassword.pending, state => {
                state.resetPassword.loading = true;
                state.resetPassword.error = null;
                state.resetPassword.success = false;
            })
            .addCase(resetPassword.fulfilled, state => {
                state.resetPassword.loading = false;
                state.resetPassword.success = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPassword.loading = false;
                state.resetPassword.error = action.payload;
            });
        builder
            .addCase(getUserInfo.pending, state => {
                state.getUserInfo.loading = true;
                state.getUserInfo.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.getUserInfo.loading = false;
                state.user = action.payload;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                }
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.getUserInfo.loading = false;
                state.getUserInfo.error = action.payload;
            });
        builder
            .addCase(updateUser.pending, state => {
                state.updateUser.loading = true;
                state.updateUser.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updateUser.loading = false;
                state.user = action.payload;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updateUser.loading = false;
                state.updateUser.error = action.payload;
            });
        builder
            .addCase(updateUserEmail.pending, state => {
                state.updateUserEmail.loading = true;
                state.updateUserEmail.error = null;
                state.updateUserEmail.success = false;
            })
            .addCase(updateUserEmail.fulfilled, state => {
                state.updateUserEmail.loading = false;
                state.updateUserEmail.success = true;
            })
            .addCase(updateUserEmail.rejected, (state, action) => {
                state.updateUserEmail.loading = false;
                state.updateUserEmail.error = action.payload;
            });
        builder
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
            });
        builder
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

export const { resetSignUp, resetSignIn, resetChangePassword, signOutLocal } = authSlice.actions;
export default authSlice.reducer;
