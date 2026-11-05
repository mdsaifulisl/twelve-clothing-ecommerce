import axiosInstance from '../../api/axiosInstance'; 

export const fetchProductsAPI = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

export const fetchProductByIdAPI = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const createProductAPI = async (productData: FormData | object) => {
  const response = await axiosInstance.post('/products', productData, {
    headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateProductAPI = async (id: string, productData: FormData | object) => {
  const response = await axiosInstance.patch(`/products/${id}`, productData, {
    headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteProductAPI = async (id: string) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};