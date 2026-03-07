import { apiSlice } from '../api/apiSlice';

export const historyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: (page = 1) => ({
        url: '/history',
        method: 'GET',
        params: { page },
      }),
      providesTags: ['History'],
    }),
    addHistory: builder.mutation({
      query: (historyData) => ({
        url: '/history',
        method: 'POST',
        data: historyData,
      }),
      invalidatesTags: ['History'],
    }),
  }),
});

export const {
  useGetHistoryQuery,
  useAddHistoryMutation,
} = historyApi;
