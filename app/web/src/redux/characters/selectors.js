import { createSelector } from '@reduxjs/toolkit';

export const selectGetCharactersState = state => state.characters.getCharacters;
export const selectGetCharactersLoading = state => state.characters.getCharacters.loading;
export const selectGetCharactersError = state => state.characters.getCharacters.error;

export const selectCharactersRaw = state => state.characters.getCharacters.characters ?? [];

export const selectCharacters = createSelector(selectCharactersRaw, list =>
    list.map(({ id, name }) => ({ id, content: name }))
);
