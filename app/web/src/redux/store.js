import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import charactersReducer from './characters/slice';
import locationsReducer from './locations/slice';
import worksReducer from './works/slice';
import helpersReducer from './helpers/slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        characters: charactersReducer,
        locations: locationsReducer,
        works: worksReducer,
        helpers: helpersReducer,
    },
});
