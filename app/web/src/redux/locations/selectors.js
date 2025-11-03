import { createSelector } from '@reduxjs/toolkit';

export const selectGetLocationsLoading = state => state.locations.getLocations.loading;
export const selectGetLocationsError = state => state.locations.getLocations.error;

export const selectLocationsRaw = state => state.locations.locations ?? [];
export const selectLocations = createSelector(selectLocationsRaw, list =>
    list.map(item => ({ ...item, content: item.title, to: `/locations/${item.id}` }))
);

export const selectLocation = state => state.locations.location;

export const selectCreateLocationLoading = state => state.locations.createLocation.loading;
export const selectCreateLocationError = state => state.locations.createLocation.error;

export const selectGetLocationLoading = state => state.locations.getLocation.loading;
export const selectGetLocationError = state => state.locations.getLocation.error;

export const selectUpdateLocationLoading = state => state.locations.updateLocation.loading;
export const selectUpdateLocationError = state => state.locations.updateLocation.error;

export const selectDeleteLocationLoading = state => state.locations.deleteLocation.loading;
export const selectDeleteLocationError = state => state.locations.deleteLocation.error;
export const selectDeleteLocationSuccess = state => state.locations.deleteLocation.success;

export const selectGetLocationPlacementsLoading = state => state.locations.getLocationPlacements.loading;
export const selectGetLocationPlacementsError = state => state.locations.getLocationPlacements.error;
export const selectLocationPlacementsRaw = state => state.locations.getLocationPlacements.placements ?? [];

export const selectLocationPlacements = createSelector(selectLocationPlacementsRaw, list =>
    list.map(item => ({
        ...item,
        content: item.work.title,
        to: `/works/${item.work_id}/location-links/${item.id}`,
    }))
);

export const selectGetLocationPossiblePlacementsLoading = state =>
    state.locations.getLocationPossiblePlacements.loading;
export const selectGetLocationPossiblePlacementsError = state => state.locations.getLocationPossiblePlacements.error;
export const selectLocationPossiblePlacementsRaw = state =>
    state.locations.getLocationPossiblePlacements.possiblePlacements ?? [];

export const selectLocationPossiblePlacements = createSelector(selectLocationPossiblePlacementsRaw, list =>
    list.map(item => ({ ...item, content: item.title, to: `/works/${item.id}` }))
);
