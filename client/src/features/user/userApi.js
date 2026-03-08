import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Favorites
    getFavorites: builder.query({
      query: () => ({
        url: '/favorites',
        method: 'GET',
      }),
      providesTags: ['Favorite'],
    }),
    addToFavorites: builder.mutation({
      query: (data) => ({
        url: '/favorites',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Favorite'],
    }),
    removeFromFavorites: builder.mutation({
      query: (tmdbId) => ({
        url: `/favorites/${tmdbId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),

    // Watchlist
    getWatchlist: builder.query({
      query: () => ({
        url: '/watchlist',
        method: 'GET',
      }),
      providesTags: ['Watchlist'],
    }),
    addToWatchlist: builder.mutation({
      query: (data) => ({
        url: '/watchlist',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Watchlist'],
    }),
    removeFromWatchlist: builder.mutation({
      query: (tmdbId) => ({
        url: `/watchlist/${tmdbId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Watchlist'],
    }),

    // History
    getHistory: builder.query({
      query: () => ({
        url: '/history',
        method: 'GET',
      }),
      providesTags: ['History'],
    }),
    addToHistory: builder.mutation({
      query: (data) => ({
        url: '/history',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['History'],
    }),
    clearHistory: builder.mutation({
      query: () => ({
        url: '/history',
        method: 'DELETE',
      }),
      invalidatesTags: ['History'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetHistoryQuery,
  useAddToHistoryMutation,
  useClearHistoryMutation,
} = userApi;
