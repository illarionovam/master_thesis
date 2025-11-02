import { createSelector } from '@reduxjs/toolkit';

export const selectGetCharactersLoading = state => state.characters.getCharacters.loading;
export const selectGetCharactersError = state => state.characters.getCharacters.error;

export const selectCharactersRaw = state => state.characters.characters ?? [];
export const selectCharacters = createSelector(selectCharactersRaw, list =>
    list.map(({ id, name }) => ({ id, content: name, to: `/characters/${id}` }))
);

export const selectCharacter = state => state.characters.character;

export const selectCreateCharacterLoading = state => state.characters.createCharacter.loading;
export const selectCreateCharacterError = state => state.characters.createCharacter.error;

export const selectGetCharacterLoading = state => state.characters.getCharacter.loading;
export const selectGetCharacterError = state => state.characters.getCharacter.error;

export const selectUpdateCharacterLoading = state => state.characters.updateCharacter.loading;
export const selectUpdateCharacterError = state => state.characters.updateCharacter.error;

export const selectDeleteCharacterLoading = state => state.characters.deleteCharacter.loading;
export const selectDeleteCharacterError = state => state.characters.deleteCharacter.error;
export const selectDeleteCharacterSuccess = state => state.characters.deleteCharacter.success;

export const selectGetCharacterAppearancesLoading = state => state.characters.getCharacterAppearances.loading;
export const selectGetCharacterAppearancesError = state => state.characters.getCharacterAppearances.error;

export const selectCharacterAppearancesRaw = state => state.characters.getCharacterAppearances.appearances ?? [];

export const selectCharacterAppearances = createSelector(selectCharacterAppearancesRaw, list =>
    list.map(({ id, work_id, work }) => ({ id, content: work.title, to: `/works/${work_id}/cast/${id}` }))
);

export const selectGetCharacterPossibleAppearancesLoading = state =>
    state.characters.getCharacterPossibleAppearances.loading;
export const selectGetCharacterPossibleAppearancesError = state =>
    state.characters.getCharacterPossibleAppearances.error;

export const selectCharacterPossibleAppearancesRaw = state =>
    state.characters.getCharacterPossibleAppearances.possibleAppearances ?? [];

export const selectCharacterPossibleAppearances = createSelector(selectCharacterPossibleAppearancesRaw, list =>
    list.map(({ id, title }) => ({ id, content: title, to: `/works/${id}` }))
);
