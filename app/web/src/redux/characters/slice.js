import { createSlice } from '@reduxjs/toolkit';
import { getCharacters } from './operations';

const initialState = {
    getCharacters: {
        loading: false,
        error: null,
        characters: [],
    },
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
                state.getCharacters.characters = action.payload;
            })
            .addCase(getCharacters.rejected, (state, action) => {
                state.getCharacters.loading = false;
                state.getCharacters.error = action.payload;
            });
    },
});

export default charactersSlice.reducer;
