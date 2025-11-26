import { createSelector } from '@reduxjs/toolkit';

export const selectToken = state => state.auth.token;
export const selectUser = state => state.auth.user;

export const selectSignUpLoading = state => state.auth.signUp.loading;
export const selectSignUpError = state => state.auth.signUp.error;
export const selectSignUpSuccess = state => state.auth.signUp.success;

export const selectSignInLoading = state => state.auth.signIn.loading;
export const selectSignInError = state => state.auth.signIn.error;

export const selectVerifyEmailLoading = state => state.auth.verifyEmail.loading;
export const selectVerifyEmailError = state => state.auth.verifyEmail.error;

export const selectResetPasswordLoading = state => state.auth.resetPassword.loading;
export const selectResetPasswordError = state => state.auth.resetPassword.error;

export const selectGetUserInfoLoading = state => state.auth.getUserInfo.loading;
export const selectGetUserInfoError = state => state.auth.getUserInfo.error;

export const selectUpdateUserLoading = state => state.auth.updateUser.loading;
export const selectUpdateUserError = state => state.auth.updateUser.error;

export const selectUpdateUserEmailLoading = state => state.auth.updateUserEmail.loading;
export const selectUpdateUserEmailError = state => state.auth.updateUserEmail.error;

export const selectConfirmEmailLoading = state => state.auth.confirmEmail.loading;
export const selectConfirmEmailError = state => state.auth.confirmEmail.error;

export const selectConfirmPasswordLoading = state => state.auth.confirmPassword.loading;
export const selectConfirmPasswordError = state => state.auth.confirmPassword.error;

export const selectAnyAuthLoading = createSelector(
    [
        selectSignUpLoading,
        selectSignInLoading,
        selectVerifyEmailLoading,
        selectResetPasswordLoading,
        selectGetUserInfoLoading,
        selectUpdateUserLoading,
        selectUpdateUserEmailLoading,
        selectConfirmEmailLoading,
        selectConfirmPasswordLoading,
    ],
    (...loadings) => loadings.some(Boolean)
);
