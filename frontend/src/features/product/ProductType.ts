/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IProduct {
  sku: any;
  id: string;
  title: string;
  price: number;
  discount?: number;
  category: string;
  subCategory: string;
  productType: string;
  color: string;
  availableSizes: string[];
  description: string;
  material?: string;
  fit?: string;
  careInstructions?: string[];
  image: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductState {
  products: IProduct[];
  product: IProduct | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}