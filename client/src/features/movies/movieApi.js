import { apiSlice } from '../api/apiSlice';

export const movieApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrending: builder.query({
      query: ({ mediaType, timeWindow, page = 1 }) => ({
        url: `/tmdb/trending/${mediaType}/${timeWindow}`,
        method: 'GET',
        params: { page },
      }),
      providesTags: ['Movie'],
    }),
    getMovieDetails: builder.query({
      query: (id) => ({
        url: `/tmdb/movie/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
    }),
    getTvDetails: builder.query({
      query: (id) => ({
        url: `/tmdb/tv/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Movie', id }], // Still using Movie tag for consistency in details
    }),
    getVideos: builder.query({
      query: ({ mediaType, id }) => ({
        url: `/tmdb/${mediaType}/${id}/videos`,
        method: 'GET',
      }),
    }),
    searchMulti: builder.query({
      query: ({ query, page = 1 }) => ({
        url: '/tmdb/search/multi',
        method: 'GET',
        params: { query, page },
      }),
    }),
    discover: builder.query({
      query: ({ mediaType, with_genres, page = 1 }) => ({
        url: `/tmdb/discover/${mediaType}`,
        method: 'GET',
        params: { with_genres, page },
      }),
    }),
    getPersonDetails: builder.query({
      query: (id) => ({
        url: `/tmdb/person/${id}`,
        method: 'GET',
      }),
    }),
    getPersonCredits: builder.query({
      query: (id) => ({
        url: `/tmdb/person/${id}/combined_credits`,
        method: 'GET',
      }),
    }),
    getRecommendations: builder.query({
      query: ({ mediaType, id, page = 1 }) => ({
        url: `/tmdb/${mediaType}/${id}/recommendations`,
        method: 'GET',
        params: { page },
      }),
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetMovieDetailsQuery,
  useGetTvDetailsQuery,
  useGetVideosQuery,
  useSearchMultiQuery,
  useDiscoverQuery,
  useGetPersonDetailsQuery,
  useGetPersonCreditsQuery,
  useGetRecommendationsQuery,
} = movieApiSlice;
