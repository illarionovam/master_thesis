import { createSelector } from '@reduxjs/toolkit';
import { selectAnyAuthLoading } from './auth/selectors';
import { selectAnyWorksLoading } from './works/selectors';
import { selectAnyLocationsLoading } from './locations/selectors';
import { selectAnyCharactersLoading } from './characters/selectors';

export const selectGlobalLoading = createSelector(
    [selectAnyAuthLoading, selectAnyWorksLoading, selectAnyLocationsLoading, selectAnyCharactersLoading],
    (...flags) => flags.some(Boolean)
);
