import { createSlice } from '@reduxjs/toolkit';
import { getWorks } from './operations';

const initialState = {
    getWorks: {
        loading: false,
        error: null,
        works: [],
    },
};

const worksSlice = createSlice({
    name: 'works',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getWorks.pending, state => {
                state.getWorks.loading = true;
                state.getWorks.error = null;
            })
            .addCase(getWorks.fulfilled, (state, action) => {
                state.getWorks.loading = false;
                state.getWorks.works = action.payload;
            })
            .addCase(getWorks.rejected, (state, action) => {
                state.getWorks.loading = false;
                state.getWorks.error = action.payload;
            });
    },
});

export default worksSlice.reducer;
