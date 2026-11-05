import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  blockCustomer,
  blockIpAddress,
  clearCustomerManagementError,
  changeCustomerDeviceBlock,
  fetchCustomerManagement,
  unblockCustomer,
  unblockIpAddress,
} from './customerSlice';

export const useCustomer = () => {
  const dispatch = useAppDispatch();
  const { customers, blockedIps, isLoading, error, mutationId } = useAppSelector((state) => state.customerManagement);

  const fetchCustomers = useCallback((search?: string) => dispatch(fetchCustomerManagement({ search })), [dispatch]);
  const blockById = useCallback(async (id: string) => await dispatch(blockCustomer({ id })).unwrap(), [dispatch]);
  const unblockById = useCallback(async (id: string) => await dispatch(unblockCustomer({ id })).unwrap(), [dispatch]);
  const setDeviceBlocked = useCallback(async (id: string, blocked: boolean) => await dispatch(changeCustomerDeviceBlock({ id, blocked })).unwrap(), [dispatch]);
  const blockIp = useCallback(async (ipAddress: string) => await dispatch(blockIpAddress({ ipAddress })).unwrap(), [dispatch]);
  const unblockIp = useCallback(async (id: string) => await dispatch(unblockIpAddress({ id })).unwrap(), [dispatch]);
  const clearError = useCallback(() => dispatch(clearCustomerManagementError()), [dispatch]);

  return { customers, blockedIps, isLoading, error, mutationId, fetchCustomers, blockById, unblockById, setDeviceBlocked, blockIp, unblockIp, clearError };
};
