import axiosInstance from '../../api/axiosInstance';

export const fetchUsersAPI = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const fetchUserByIdAPI = async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const createUserAPI = async (userData: object) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

export const updateUserAPI = async (id: string, userData: object) => {
  const response = await axiosInstance.patch(`/users/${id}`, userData);
  return response.data;
};

export const deleteUserAPI = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};