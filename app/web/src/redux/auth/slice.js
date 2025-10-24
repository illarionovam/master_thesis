import { createSlice } from '@reduxjs/toolkit';
import { signUp } from './operations';

const initialState = {
    signUp: {
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
            });
    },
});

export const { resetSignUp } = authSlice.actions;
export default authSlice.reducer;
