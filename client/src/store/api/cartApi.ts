import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CartItem } from '../../types';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<CartItem, { productId: string; quantity: number }>({
      query: (data) => ({ url: '/cart', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<CartItem, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<{ message: string }, string>({
      query: (productId) => ({ url: `/cart/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
