import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import authSliceReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';

// Persist configuration
const persistConfig = {
    key: 'auth', 
    storage,
    whitelist: ['userInfo', 'accessToken', 'isAuthenticated'], // Only persist required fields
  };
  

// Combine reducers
const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer, // Non-persistent API state
    auth: persistReducer(persistConfig, authSliceReducer), // Persistent auth slice
});


// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
