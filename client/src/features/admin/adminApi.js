import { apiSlice } from '../api/apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard Stats
    getAdminStats: builder.query({
      query: () => ({
        url: '/admin/stats',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
    // Movies Management
    getAdminMovies: builder.query({
      query: (page = 1) => ({
        url: '/admin/movies',
        method: 'GET',
        params: { page },
      }),
      providesTags: ['Admin', 'Movie'],
    }),
    createMovie: builder.mutation({
      query: (movieData) => ({
        url: '/admin/movies',
        method: 'POST',
        data: movieData,
      }),
      invalidatesTags: ['Admin', 'Movie'],
    }),
    updateMovie: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/admin/movies/${id}`,
        method: 'PUT',
        data: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Movie', id },
        'Admin',
      ],
    }),
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/admin/movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin', 'Movie'],
    }),

    // User Management
    getUsers: builder.query({
      query: (page = 1) => ({
        url: '/admin/users',
        method: 'GET',
        params: { page },
      }),
      providesTags: ['Admin', 'User'],
    }),
    banUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/ban`,
        method: 'PUT',
      }),
      invalidatesTags: ['Admin', 'User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin', 'User'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useGetUsersQuery,
  useBanUserMutation,
  useDeleteUserMutation,
} = adminApi;
