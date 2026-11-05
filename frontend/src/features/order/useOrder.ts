import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  changeSellerOrderArchive,
  changeSellerOrderStatus,
  clearCreatedOrder,
  clearTrackedOrder,
  fetchSellerOrders,
  findCustomerOrder,
  markSellerOrderSeen,
  placeOrder,
} from './orderSlice';
import type { CreateOrderRequest, OrderStatus, SellerOrderQuery } from './orderType';

export const useOrder = () => {
  const dispatch = useAppDispatch();
  const orderState = useAppSelector((state) => state.orders);

  const loadSellerOrders = useCallback((query: SellerOrderQuery) => dispatch(fetchSellerOrders(query)), [dispatch]);
  const updateStatus = useCallback(async (id: string, status: OrderStatus) => await dispatch(changeSellerOrderStatus({ id, status })).unwrap(), [dispatch]);
  const updateArchive = useCallback(async (id: string, archived: boolean) => await dispatch(changeSellerOrderArchive({ id, archived })).unwrap(), [dispatch]);
  const markSeen = useCallback(async (id: string) => await dispatch(markSellerOrderSeen({ id })).unwrap(), [dispatch]);
  const submitOrder = useCallback(async (payload: CreateOrderRequest) => await dispatch(placeOrder(payload)).unwrap(), [dispatch]);
  const lookupOrder = useCallback(async (orderCode: string, phone: string) => await dispatch(findCustomerOrder({ orderCode, phone })).unwrap(), [dispatch]);
  const resetCreatedOrder = useCallback(() => dispatch(clearCreatedOrder()), [dispatch]);
  const resetTrackedOrder = useCallback(() => dispatch(clearTrackedOrder()), [dispatch]);

  return {
    ...orderState,
    loadSellerOrders,
    updateStatus,
    updateArchive,
    markSeen,
    submitOrder,
    lookupOrder,
    resetCreatedOrder,
    resetTrackedOrder,
  };
};
