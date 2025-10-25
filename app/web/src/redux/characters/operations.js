import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppUserCharacters } from '../../api/characters.js';
import wrapper from '../wrapper.js';

export const getCharacters = createAsyncThunk('characters/getCharacters', async (_, { rejectWithValue }) => {
    return wrapper(getAppUserCharacters, rejectWithValue)();
});
