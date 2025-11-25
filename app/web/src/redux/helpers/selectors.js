import { createSelector } from '@reduxjs/toolkit';

export const selectUploadImageLoading = state => state.helpers.uploadImage.loading;
export const selectUploadImageError = state => state.helpers.uploadImage.error;

export const selectAnyHelpersLoading = createSelector([selectUploadImageLoading], (...loadings) =>
    loadings.some(Boolean)
);
