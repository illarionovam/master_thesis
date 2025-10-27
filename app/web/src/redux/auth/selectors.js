export const selectAuth = state => state.auth;

export const selectSignUpLoading = state => state.auth.signUp.loading;
export const selectSignUpError = state => state.auth.signUp.error;
export const selectSignUpResult = state => state.auth.signUp.result;

export const selectSignInLoading = state => state.auth.signIn.loading;
export const selectSignInError = state => state.auth.signIn.error;
export const selectSignInResult = state => state.auth.signIn.result;

export const selectToken = state => state.auth.token;
export const selectUser = state => state.auth.user;

export const selectConfirmEmailLoading = state => state.auth.confirmEmail.loading;
export const selectConfirmEmailError = state => state.auth.confirmEmail.error;
export const selectConfirmEmailSuccess = state => state.auth.confirmEmail.success;

export const selectConfirmPasswordLoading = state => state.auth.confirmPassword.loading;
export const selectConfirmPasswordError = state => state.auth.confirmPassword.error;
export const selectConfirmPasswordSuccess = state => state.auth.confirmPassword.success;

export const selectGetUserInfoLoading = state => state.auth.getUserInfo.loading;
export const selectGetUserInfoError = state => state.auth.getUserInfo.error;
