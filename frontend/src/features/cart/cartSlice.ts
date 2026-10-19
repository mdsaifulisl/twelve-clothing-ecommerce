import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('panjabi_cart_items');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('panjabi_cart_items', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // quantity ফিল্ডটি অপশনাল (Omit<CartItem, 'quantity'> & { quantity?: number }) করা হয়েছে
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>
    ) => {
      const qtyToAdd = action.payload.quantity ?? 1;

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else { 
        state.items.push({
          id: action.payload.id,
          title: action.payload.title,
          price: action.payload.price,
          image: action.payload.image,
          size: action.payload.size, 
          color: action.payload.color,
          sku: action.payload.sku,
          quantity: qtyToAdd,
        });
      }
      state.isOpen = true;
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; size: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size)
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    toggleCartDrawer: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCartDrawer,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;