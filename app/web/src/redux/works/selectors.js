import { createSelector } from '@reduxjs/toolkit';

export const selectGetWorksState = state => state.works.getWorks;
export const selectGetWorksLoading = state => state.works.getWorks.loading;
export const selectGetWorksError = state => state.works.getWorks.error;

export const selectWorksRaw = state => state.works.getWorks.works ?? [];

export const selectWorks = createSelector(selectWorksRaw, list =>
    list.map(({ id, title }) => ({ id, content: title }))
);
