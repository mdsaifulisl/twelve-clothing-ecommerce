import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserState,
} from './userSlice';
import type { UpdateUserData } from './userType';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { users, user, isLoading, error, success } = useAppSelector((state) => state.user);

  const fetchAllUsers = () => {
    dispatch(getUsers());
  };

  const fetchSingleUser = (id: string) => {
    dispatch(getUserById(id));
  };

  const addNewUser = async (userData: object) => {
    return await dispatch(createUser(userData)).unwrap();
  };

  const editUser = async (id: string, userData: UpdateUserData) => {
    return await dispatch(updateUser({ id, userData })).unwrap();
  };

  const removeUser = async (id: string) => {
    return await dispatch(deleteUser(id)).unwrap();
  };

  const resetState = () => {
    dispatch(resetUserState());
  };

  return {
    users,
    user,
    isLoading,
    error,
    success,
    fetchAllUsers,
    fetchSingleUser,
    addNewUser,
    editUser,
    removeUser,
    resetState,
  };
};