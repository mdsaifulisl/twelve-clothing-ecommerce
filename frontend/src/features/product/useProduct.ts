import { useAppDispatch, useAppSelector } from '../../app/hooks'; 
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProductState,
} from './ProductSlice';

export const useProduct = () => {
  const dispatch = useAppDispatch();
  const { products, product, isLoading, error, success } = useAppSelector((state) => state.product);

  const fetchAllProducts = () => {
    dispatch(getProducts());
  };

  const fetchSingleProduct = (id: string) => {
    dispatch(getProductById(id));
  };

  const addProduct = async (productData: FormData | object) => {
  return await dispatch(createProduct(productData)).unwrap();
};

const editProduct = async (id: string, productData: FormData | object) => {
  return await dispatch(updateProduct({ id, productData })).unwrap(); 
};

  const removeProduct = async (id: string) => {
    return await dispatch(deleteProduct(id)).unwrap();
  };

  const resetState = () => {
    dispatch(resetProductState());
  };

  return {
    products,
    product,
    isLoading,
    error,
    success,
    fetchAllProducts,
    fetchSingleProduct,
    addProduct,
    editProduct,
    removeProduct,
    resetState,
  };
};