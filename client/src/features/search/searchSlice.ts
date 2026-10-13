import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface SearchState {
  query: string;
  isOpen: boolean;
  searchResults: Product[];
}

// ডামি প্রোডাক্ট ডেটা
const allProducts: Product[] = [
  { 
    id: '1', 
    title: 'Premium Cotton Executive Panjabi', 
    price: 2500, 
    image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=200', 
    category: 'Panjabi' 
  },
  { 
    id: '2', 
    title: 'Traditional Silk Embroidered Panjabi', 
    price: 4200, 
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=200', 
    category: 'Panjabi' 
  },
  { 
    id: '3', 
    title: 'Festive Special Kabli Set', 
    price: 3100, 
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=200', 
    category: 'Kabli Set' 
  },
  { 
    id: '4', 
    title: 'Casual Slim Fit Cotton Panjabi', 
    price: 1800, 
    image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=200', 
    category: 'Panjabi' 
  },
];

const initialState: SearchState = {
  query: '',
  isOpen: false,
  searchResults: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (action.payload.trim() === '') {
        state.searchResults = [];
      } else {
        state.searchResults = allProducts.filter((product) =>
          product.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          product.category.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    toggleSearchModal: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
      if (!action.payload) {
        state.query = '';
        state.searchResults = [];
      }
    },
  },
});

export const { setSearchQuery, toggleSearchModal } = searchSlice.actions;
export default searchSlice.reducer;