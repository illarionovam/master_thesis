import { createSlice } from '@reduxjs/toolkit';
import {
    getCharacters,
    createCharacter,
    getCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
    generateCharacterImage,
} from './operations';
import { linkWorkCharacter, deleteCharacterInWork } from '../works/operations';
import { stripBulkCharacterInWorkResponse, stripBulkCharacterResponse } from '../../../../api/helpers/strippers';

const op = { loading: false, error: null };

const initialState = {
    characters: [],
    character: null,
    getCharacters: { ...op },
    createCharacter: { ...op },
    getCharacter: { ...op },
    updateCharacter: { ...op },
    deleteCharacter: { ...op },
    getCharacterAppearances: { ...op, appearances: [] },
    getCharacterPossibleAppearances: { ...op, possibleAppearances: [] },
    generateCharacterImage: { ...op },
};

const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCharacters.pending, state => {
                state.getCharacters.loading = true;
                state.getCharacters.error = null;
            })
            .addCase(getCharacters.fulfilled, (state, action) => {
                state.getCharacters.loading = false;
                state.characters = action.payload;
            })
            .addCase(getCharacters.rejected, (state, action) => {
                state.getCharacters.loading = false;
                state.getCharacters.error = action.payload;
            });
        builder
            .addCase(createCharacter.pending, state => {
                state.createCharacter.loading = true;
                state.createCharacter.error = null;
            })
            .addCase(createCharacter.fulfilled, (state, action) => {
                state.createCharacter.loading = false;
                state.characters = [...state.characters, stripBulkCharacterResponse(action.payload)];
            })
            .addCase(createCharacter.rejected, (state, action) => {
                state.createCharacter.loading = false;
                state.createCharacter.error = action.payload;
            });
        builder
            .addCase(getCharacter.pending, state => {
                state.getCharacter.loading = true;
                state.getCharacter.error = null;
            })
            .addCase(getCharacter.fulfilled, (state, action) => {
                state.getCharacter.loading = false;
                state.character = action.payload;
            })
            .addCase(getCharacter.rejected, (state, action) => {
                state.getCharacter.loading = false;
                state.getCharacter.error = action.payload;
            });
        builder
            .addCase(updateCharacter.pending, state => {
                state.updateCharacter.loading = true;
                state.updateCharacter.error = null;
            })
            .addCase(updateCharacter.fulfilled, (state, action) => {
                state.updateCharacter.loading = false;
                state.character = action.payload;
            })
            .addCase(updateCharacter.rejected, (state, action) => {
                state.updateCharacter.loading = false;
                state.updateCharacter.error = action.payload;
            });
        builder
            .addCase(generateCharacterImage.pending, state => {
                state.generateCharacterImage.loading = true;
                state.generateCharacterImage.error = null;
            })
            .addCase(generateCharacterImage.fulfilled, (state, action) => {
                state.generateCharacterImage.loading = false;
                state.character = action.payload;
            })
            .addCase(generateCharacterImage.rejected, (state, action) => {
                state.generateCharacterImage.loading = false;
                state.generateCharacterImage.error = action.payload;
            });
        builder
            .addCase(deleteCharacter.pending, state => {
                state.deleteCharacter.loading = true;
                state.deleteCharacter.error = null;
            })
            .addCase(deleteCharacter.fulfilled, (state, action) => {
                const id = action.meta.arg;

                state.deleteCharacter.loading = false;
                state.characters = state.characters.filter(item => item.id !== id);
                state.character = null;
            })
            .addCase(deleteCharacter.rejected, (state, action) => {
                state.deleteCharacter.loading = false;
                state.deleteCharacter.error = action.payload;
            });
        builder
            .addCase(getCharacterAppearances.pending, state => {
                state.getCharacterAppearances.loading = true;
                state.getCharacterAppearances.error = null;
            })
            .addCase(getCharacterAppearances.fulfilled, (state, action) => {
                state.getCharacterAppearances.loading = false;
                state.getCharacterAppearances.appearances = action.payload;
            })
            .addCase(getCharacterAppearances.rejected, (state, action) => {
                state.getCharacterAppearances.loading = false;
                state.getCharacterAppearances.error = action.payload;
            });
        builder
            .addCase(getCharacterPossibleAppearances.pending, state => {
                state.getCharacterPossibleAppearances.loading = true;
                state.getCharacterPossibleAppearances.error = null;
            })
            .addCase(getCharacterPossibleAppearances.fulfilled, (state, action) => {
                state.getCharacterPossibleAppearances.loading = false;
                state.getCharacterPossibleAppearances.possibleAppearances = action.payload;
            })
            .addCase(getCharacterPossibleAppearances.rejected, (state, action) => {
                state.getCharacterPossibleAppearances.loading = false;
                state.getCharacterPossibleAppearances.error = action.payload;
            });
        builder.addCase(linkWorkCharacter.fulfilled, (state, action) => {
            const { from } = action.meta.arg;

            if (from !== 'character') return;

            state.getCharacterAppearances.appearances = [
                ...state.getCharacterAppearances.appearances,
                stripBulkCharacterInWorkResponse(action.payload),
            ];
            state.getCharacterPossibleAppearances.possibleAppearances =
                state.getCharacterPossibleAppearances.possibleAppearances.filter(
                    item => item.id !== action.payload.work_id
                );
        });
        builder.addCase(deleteCharacterInWork.fulfilled, (state, action) => {
            const { characterInWorkId, from } = action.meta.arg;

            if (from !== 'character') return;

            let removedAppearance = null;
            state.getCharacterAppearances.appearances = state.getCharacterAppearances.appearances.filter(item => {
                if (item.id === characterInWorkId) {
                    removedAppearance = item;
                    return false;
                }
                return true;
            });

            state.getCharacterPossibleAppearances.possibleAppearances = [
                ...state.getCharacterPossibleAppearances.possibleAppearances,
                removedAppearance.work,
            ];
        });
    },
});

export default charactersSlice.reducer;
