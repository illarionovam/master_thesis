import { createSelector } from '@reduxjs/toolkit';

export const selectGetLocationsState = state => state.locations.getLocations;
export const selectGetLocationsLoading = state => state.locations.getLocations.loading;
export const selectGetLocationsError = state => state.locations.getLocations.error;

export const selectLocationsRaw = state => state.locations.getLocations.locations;

export const selectLocations = createSelector(selectLocationsRaw, list =>
    list.map(({ id, title }) => ({ id, content: title }))
);
