import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Make sure you import storage

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

// Rename this variable to avoid conflict
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, // Use renamed variable
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Corrected typo
        }),
});

export const persistor = persistStore(store);
