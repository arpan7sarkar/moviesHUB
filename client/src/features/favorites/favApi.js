import { apiSlice } from '../api/apiSlice';

export const favApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => ({
        url: '/favorites',
        method: 'GET',
      }),
      providesTags: ['Favorite'],
    }),
    addFavorite: builder.mutation({
      query: (favoriteData) => ({
        url: '/favorites',
        method: 'POST',
        data: favoriteData,
      }),
      invalidatesTags: ['Favorite'],
    }),
    removeFavorite: builder.mutation({
      query: (id) => ({
        url: `/favorites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favApi;
