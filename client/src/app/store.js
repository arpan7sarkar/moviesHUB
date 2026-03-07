import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';

/**
 * Redux Store Configuration
 * 
 * Centralized store that integrates:
 * - auth: User state and authentication
 * - theme: Dark/Light mode preferences
 * - [api.reducerPath]: Automated RTK Query API state (caching, query states)
 */
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    theme: themeReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of rtk-query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

