import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsResponse, ProductQueryParams, Category } from '../../types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductQueryParams>({
      query: (params) => ({ url: '/products', params }),
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories',
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => '/products/featured',
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetFeaturedProductsQuery,
} = productsApi;
