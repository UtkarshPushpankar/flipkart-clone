import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

interface CartState {
  itemCount: number;
}

const initialState: CartState = { itemCount: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },
  },
});

export const { setCartCount } = cartSlice.actions;
export default cartSlice.reducer;
