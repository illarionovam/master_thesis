import { createSlice } from '@reduxjs/toolkit';
import { uploadImageHelper } from './operations.js';

const op = { loading: false, error: null };

const initialState = {
    uploadImage: {
        ...op,
    },
};

const helpersSlice = createSlice({
    name: 'helpers',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(uploadImageHelper.pending, state => {
                state.uploadImage.loading = true;
                state.uploadImage.error = null;
                state.uploadImage.url = null;
            })
            .addCase(uploadImageHelper.fulfilled, state => {
                state.uploadImage.loading = false;
            })
            .addCase(uploadImageHelper.rejected, (state, action) => {
                state.uploadImage.loading = false;
                state.uploadImage.error = action.payload;
            });
    },
});

export default helpersSlice.reducer;
