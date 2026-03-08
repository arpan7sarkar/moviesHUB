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
      query: ({ page = 1, search = '', category = '' } = {}) => ({
        url: '/admin/movies',
        method: 'GET',
        params: { page, search, category },
      }),
      providesTags: ['Admin', 'Movie'],
    }),
    getAdminMovieById: builder.query({
      query: (id) => ({
        url: `/admin/movies/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
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
      query: ({ page = 1, search = '' } = {}) => ({
        url: '/admin/users',
        method: 'GET',
        params: { page, search },
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
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        data: { role },
      }),
      invalidatesTags: ['Admin', 'User'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminMoviesQuery,
  useGetAdminMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useGetUsersQuery,
  useBanUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} = adminApi;
