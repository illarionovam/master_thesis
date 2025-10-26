import { createSlice } from '@reduxjs/toolkit';
import { getLocations } from './operations';

const initialState = {
    getLocations: {
        loading: false,
        error: null,
        locations: [],
    },
};

const locationsSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getLocations.pending, state => {
                state.getLocations.loading = true;
                state.getLocations.error = null;
            })
            .addCase(getLocations.fulfilled, (state, action) => {
                state.getLocations.loading = false;
                state.getLocations.locations = action.payload;
            })
            .addCase(getLocations.rejected, (state, action) => {
                state.getLocations.loading = false;
                state.getLocations.error = action.payload;
            });
    },
});

export default locationsSlice.reducer;
