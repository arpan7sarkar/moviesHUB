import { apiSlice } from '../api/apiSlice';

const LIST_CACHE_SECONDS = 600;
const DETAIL_CACHE_SECONDS = 1800;

export const movieApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrending: builder.query({
      query: ({ mediaType, timeWindow, page = 1 }) => ({
        url: `/tmdb/trending/${mediaType}/${timeWindow}`,
        method: 'GET',
        params: { page },
      }),
      keepUnusedDataFor: LIST_CACHE_SECONDS,
      refetchOnMountOrArgChange: LIST_CACHE_SECONDS,
      providesTags: ['Movie'],
    }),
    getList: builder.query({
      query: ({ mediaType, listType, page = 1 }) => ({
        url: `/tmdb/${mediaType}/${listType}`,
        method: 'GET',
        params: { page },
      }),
      keepUnusedDataFor: LIST_CACHE_SECONDS,
      refetchOnMountOrArgChange: LIST_CACHE_SECONDS,
      providesTags: ['Movie'],
    }),
    getMovieDetails: builder.query({
      query: (id) => ({
        url: `/tmdb/movie/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
    }),
    getTvDetails: builder.query({
      query: (id) => ({
        url: `/tmdb/tv/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
    }),
    getVideos: builder.query({
      query: ({ mediaType, id }) => ({
        url: `/tmdb/${mediaType}/${id}/videos`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
    }),
    getCredits: builder.query({
      query: ({ mediaType, id }) => ({
        url: `/tmdb/${mediaType}/${id}/credits`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
    }),
    searchMulti: builder.query({
      query: ({ query, page = 1 }) => ({
        url: '/tmdb/search/multi',
        method: 'GET',
        params: { query, page },
      }),
      keepUnusedDataFor: LIST_CACHE_SECONDS,
      refetchOnMountOrArgChange: LIST_CACHE_SECONDS,
    }),
    discover: builder.query({
      query: ({ mediaType, page = 1, ...params }) => ({
        url: `/tmdb/discover/${mediaType}`,
        method: 'GET',
        params: { page, ...params },
      }),
      keepUnusedDataFor: LIST_CACHE_SECONDS,
      refetchOnMountOrArgChange: LIST_CACHE_SECONDS,
      providesTags: ['Movie'],
    }),
    getPersonDetails: builder.query({
      query: (id) => ({
        url: `/tmdb/person/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
    }),
    getPersonCredits: builder.query({
      query: (id) => ({
        url: `/tmdb/person/${id}/combined_credits`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
    }),
    getRecommendations: builder.query({
      query: ({ mediaType, id, page = 1 }) => ({
        url: `/tmdb/${mediaType}/${id}/recommendations`,
        method: 'GET',
        params: { page },
      }),
      keepUnusedDataFor: LIST_CACHE_SECONDS,
      refetchOnMountOrArgChange: LIST_CACHE_SECONDS,
    }),
    getSimilar: builder.query({
      query: ({ mediaType, id, page = 1 }) => ({
        url: `/tmdb/${mediaType}/${id}/similar`,
        method: 'GET',
        params: { page },
      }),
      keepUnusedDataFor: LIST_CACHE_SECONDS,
      refetchOnMountOrArgChange: LIST_CACHE_SECONDS,
    }),
    getTvSeasonDetails: builder.query({
      query: ({ tvId, seasonNumber }) => ({
        url: `/tmdb/tv/${tvId}/season/${seasonNumber}`,
        method: 'GET',
      }),
      keepUnusedDataFor: DETAIL_CACHE_SECONDS,
      refetchOnMountOrArgChange: DETAIL_CACHE_SECONDS,
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetListQuery,
  useGetMovieDetailsQuery,
  useGetTvDetailsQuery,
  useGetVideosQuery,
  useGetCreditsQuery,
  useSearchMultiQuery,
  useDiscoverQuery,
  useGetPersonDetailsQuery,
  useGetPersonCreditsQuery,
  useGetRecommendationsQuery,
  useGetSimilarQuery,
  useGetTvSeasonDetailsQuery,
} = movieApi;

