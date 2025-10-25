import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import charactersReducer from './characters/slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        characters: charactersReducer,
    },
});
