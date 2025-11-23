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
import { linkWorkLocation, deleteLocationInWork } from '../works/operations';
import { stripBulkLocationInWorkResponse } from '../../../../api/helpers/strippers';

const op = { loading: false, error: null };

const initialState = {
    locations: [],
    location: null,
    getLocations: { ...op },
    createLocation: { ...op },
    getLocation: { ...op },
    updateLocation: { ...op },
    deleteLocation: { ...op },
    getLocationPlacements: { ...op, placements: [] },
    getLocationPossiblePlacements: { ...op, possiblePlacements: [] },
};

const locationsSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {
        resetLocation(state) {
            state.location = null;
            state.getLocation = { ...op };
            state.createLocation = { ...op };
            state.updateLocation = { ...op };
            state.deleteLocation = { ...op };
            state.getLocationPlacements = { ...op, placements: [] };
            state.getLocationPossiblePlacements = { ...op, possiblePlacements: [] };
        },
    },
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
            .addCase(createLocation.fulfilled, state => {
                state.createLocation.loading = false;
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
            })
            .addCase(deleteLocation.fulfilled, state => {
                state.deleteLocation.loading = false;
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
        builder.addCase(linkWorkLocation.fulfilled, (state, action) => {
            const { from } = action.meta.arg;

            if (from !== 'location') return;

            state.getLocationPlacements.placements = [
                ...state.getLocationPlacements.placements,
                stripBulkLocationInWorkResponse(action.payload),
            ];
            state.getLocationPossiblePlacements.possiblePlacements =
                state.getLocationPossiblePlacements.possiblePlacements.filter(
                    item => item.id !== action.payload.work_id
                );
        });
        builder.addCase(deleteLocationInWork.fulfilled, (state, action) => {
            const { locationInWorkId, from } = action.meta.arg;

            if (from !== 'location') return;

            let removedPlacement = null;
            state.getLocationPlacements.placements = state.getLocationPlacements.placements.filter(item => {
                if (item.id === locationInWorkId) {
                    removedPlacement = item;
                    return false;
                }
                return true;
            });

            state.getLocationPossiblePlacements.possiblePlacements = [
                ...state.getLocationPossiblePlacements.possiblePlacements,
                removedPlacement.work,
            ];
        });
    },
});

export const { resetLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
