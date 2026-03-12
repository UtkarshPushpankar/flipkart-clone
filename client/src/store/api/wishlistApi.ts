import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { WishlistItem } from '../../types';

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Wishlist'],
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<WishlistItem, { productId: string }>({
      query: (data) => ({ url: '/wishlist', method: 'POST', body: data }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<{ message: string }, string>({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
