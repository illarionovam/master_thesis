export const selectAuth = state => state.auth;

export const selectSignUpLoading = state => state.auth.signUp.loading;
export const selectSignUpError = state => state.auth.signUp.error;
export const selectSignUpResult = state => state.auth.signUp.result;
