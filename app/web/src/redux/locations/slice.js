import { createSlice } from '@reduxjs/toolkit';
import {
    getLocations,
    createLocation,
    getLocation,
    updateLocation,
    deleteLocation,
    getLocationPlacements,
    getLocationPossiblePlacements,
} from './operations';

const op = { loading: false, error: null };

const initialState = {
    locations: [],
    location: null,
    getLocations: { ...op },
    createLocation: { ...op },
    getLocation: { ...op },
    updateLocation: { ...op },
    deleteLocation: { ...op, success: false },
    getLocationPlacements: { ...op, placements: [] },
    getLocationPossiblePlacements: { ...op, possiblePlacements: [] },
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
                state.locations = action.payload;
            })
            .addCase(getLocations.rejected, (state, action) => {
                state.getLocations.loading = false;
                state.getLocations.error = action.payload;
            });
        builder
            .addCase(createLocation.pending, state => {
                state.createLocation.loading = true;
                state.createLocation.error = null;
            })
            .addCase(createLocation.fulfilled, (state, action) => {
                state.createLocation.loading = false;
                state.location = action.payload;
            })
            .addCase(createLocation.rejected, (state, action) => {
                state.createLocation.loading = false;
                state.createLocation.error = action.payload;
            });
        builder
            .addCase(getLocation.pending, state => {
                state.getLocation.loading = true;
                state.getLocation.error = null;
            })
            .addCase(getLocation.fulfilled, (state, action) => {
                state.getLocation.loading = false;
                state.location = action.payload;
            })
            .addCase(getLocation.rejected, (state, action) => {
                state.getLocation.loading = false;
                state.getLocation.error = action.payload;
            });
        builder
            .addCase(updateLocation.pending, state => {
                state.updateLocation.loading = true;
                state.updateLocation.error = null;
            })
            .addCase(updateLocation.fulfilled, (state, action) => {
                state.updateLocation.loading = false;
                state.location = action.payload;
            })
            .addCase(updateLocation.rejected, (state, action) => {
                state.updateLocation.loading = false;
                state.updateLocation.error = action.payload;
            });
        builder
            .addCase(deleteLocation.pending, state => {
                state.deleteLocation.loading = true;
                state.deleteLocation.error = null;
                state.deleteLocation.success = false;
            })
            .addCase(deleteLocation.fulfilled, state => {
                state.deleteLocation.loading = false;
                state.deleteLocation.success = true;
                state.location = null;
            })
            .addCase(deleteLocation.rejected, (state, action) => {
                state.deleteLocation.loading = false;
                state.deleteLocation.error = action.payload;
            });
        builder
            .addCase(getLocationPlacements.pending, state => {
                state.getLocationPlacements.loading = true;
                state.getLocationPlacements.error = null;
            })
            .addCase(getLocationPlacements.fulfilled, (state, action) => {
                state.getLocationPlacements.loading = false;
                state.getLocationPlacements.placements = action.payload;
            })
            .addCase(getLocationPlacements.rejected, (state, action) => {
                state.getLocationPlacements.loading = false;
                state.getLocationPlacements.error = action.payload;
            });
        builder
            .addCase(getLocationPossiblePlacements.pending, state => {
                state.getLocationPossiblePlacements.loading = true;
                state.getLocationPossiblePlacements.error = null;
            })
            .addCase(getLocationPossiblePlacements.fulfilled, (state, action) => {
                state.getLocationPossiblePlacements.loading = false;
                state.getLocationPossiblePlacements.possiblePlacements = action.payload;
            })
            .addCase(getLocationPossiblePlacements.rejected, (state, action) => {
                state.getLocationPossiblePlacements.loading = false;
                state.getLocationPossiblePlacements.error = action.payload;
            });
    },
});

export default locationsSlice.reducer;
