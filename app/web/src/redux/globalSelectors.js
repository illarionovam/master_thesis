import { createSelector } from '@reduxjs/toolkit';
import { selectAnyAuthLoading } from './auth/selectors';
import { selectAnyWorksLoading } from './works/selectors';
import { selectAnyLocationsLoading } from './locations/selectors';
import { selectAnyCharactersLoading } from './characters/selectors';
import { selectAnyHelpersLoading } from './helpers/selectors';

export const selectGlobalLoading = createSelector(
    [
        selectAnyAuthLoading,
        selectAnyWorksLoading,
        selectAnyLocationsLoading,
        selectAnyCharactersLoading,
        selectAnyHelpersLoading,
    ],
    (...flags) => flags.some(Boolean)
);
