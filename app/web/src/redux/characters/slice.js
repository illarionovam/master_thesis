import { createSlice } from '@reduxjs/toolkit';
import {
    getCharacters,
    createCharacter,
    getCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
} from './operations';
import { linkWorkCharacter } from '../works/operations';
import { stripBulkCharacterInWorkResponse } from '../../../../api/controllers/characterInWorkController';

const op = { loading: false, error: null };

const initialState = {
    characters: [],
    character: null,
    getCharacters: { ...op },
    createCharacter: { ...op },
    getCharacter: { ...op },
    updateCharacter: { ...op },
    deleteCharacter: { ...op, success: false },
    getCharacterAppearances: { ...op, appearances: [] },
    getCharacterPossibleAppearances: { ...op, possibleAppearances: [] },
};

const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {
        resetCharacter(state) {
            state.character = null;
            state.getCharacter = { ...op };
            state.createCharacter = { ...op };
            state.updateCharacter = { ...op };
            state.deleteCharacter = { ...op };
            state.getCharacterAppearances = { ...op, appearances: [] };
            state.getCharacterPossibleAppearances = { ...op, possibleAppearances: [] };
        },
    },
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
                state.character = action.payload;
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
            .addCase(deleteCharacter.pending, state => {
                state.deleteCharacter.loading = true;
                state.deleteCharacter.error = null;
                state.deleteCharacter.success = false;
            })
            .addCase(deleteCharacter.fulfilled, state => {
                state.deleteCharacter.loading = false;
                state.deleteCharacter.success = true;
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
            const ciw = action.payload;
            state.getCharacterAppearances.appearances = [
                ...state.getCharacterAppearances.appearances,
                stripBulkCharacterInWorkResponse(ciw),
            ];

            const workId = action.meta?.arg?.workId ?? ciw.work_id;
            state.getCharacterPossibleAppearances.possibleAppearances =
                state.getCharacterPossibleAppearances.possibleAppearances.filter(w => String(w.id) !== String(workId));
        });
    },
});

export const { resetCharacter } = charactersSlice.actions;
export default charactersSlice.reducer;
