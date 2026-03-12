import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Order, Address } from '../../types';

interface PlaceOrderRequest {
  address: Address;
  paymentMethod: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    placeOrder: builder.mutation<Order, PlaceOrderRequest>({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Orders'],
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApi;
