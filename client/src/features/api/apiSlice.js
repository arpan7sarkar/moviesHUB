import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../utils/axiosInstance';

const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  }),
  tagTypes: ['User', 'Movie', 'Favorite', 'History', 'Watchlist', 'Admin'],
  endpoints: (builder) => ({}), // Split into feature-specific slices
});
