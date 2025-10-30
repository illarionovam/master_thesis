import { createAsyncThunk } from '@reduxjs/toolkit';
import wrapper from '../wrapper.js';
import {
    getAppUserCharacters,
    createAppUserCharacter,
    getAppUserCharacter,
    updateAppUserCharacter,
    destroyAppUserCharacter,
    getAppUserCharacterAppearances,
    getAppUserCharacterPossibleAppearances,
} from '../../api/characters.js';

export const getCharacters = createAsyncThunk('characters/getCharacters', async (_, { rejectWithValue }) =>
    wrapper(getAppUserCharacters, rejectWithValue)()
);

export const createCharacter = createAsyncThunk('characters/createCharacter', async (payload, { rejectWithValue }) =>
    wrapper(createAppUserCharacter, rejectWithValue)(payload)
);

export const getCharacter = createAsyncThunk('characters/getCharacter', async (id, { rejectWithValue }) =>
    wrapper(getAppUserCharacter, rejectWithValue)(id)
);

export const updateCharacter = createAsyncThunk(
    'characters/updateCharacter',
    async ({ id, data }, { rejectWithValue }) => wrapper(updateAppUserCharacter, rejectWithValue)(id, data)
);

export const deleteCharacter = createAsyncThunk('characters/deleteCharacter', async (id, { rejectWithValue }) =>
    wrapper(destroyAppUserCharacter, rejectWithValue)(id)
);

export const getCharacterAppearances = createAsyncThunk(
    'characters/getCharacterAppearances',
    async (id, { rejectWithValue }) => wrapper(getAppUserCharacterAppearances, rejectWithValue)(id)
);

export const getCharacterPossibleAppearances = createAsyncThunk(
    'characters/getCharacterPossibleAppearances',
    async (id, { rejectWithValue }) => wrapper(getAppUserCharacterPossibleAppearances, rejectWithValue)(id)
);
