import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './api/productsApi';
import { cartApi } from './api/cartApi';
import { ordersApi } from './api/ordersApi';
import { wishlistApi } from './api/wishlistApi';
import { authApi } from './api/authApi';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
      wishlistApi.middleware,
      authApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
