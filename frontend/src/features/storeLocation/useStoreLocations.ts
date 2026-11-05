import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addStoreLocation, fetchStoreLocations, removeStoreLocation } from './storeLocationSlice';
import type { CreateStoreLocationRequest } from './storeLocationType';

export const useStoreLocations = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.storeLocations);

  const loadLocations = useCallback(() => dispatch(fetchStoreLocations()), [dispatch]);
  const createLocation = useCallback(async (payload: CreateStoreLocationRequest) =>
    await dispatch(addStoreLocation(payload)).unwrap(), [dispatch]);
  const deleteLocation = useCallback(async (id: string) =>
    await dispatch(removeStoreLocation(id)).unwrap(), [dispatch]);

  return { ...state, loadLocations, createLocation, deleteLocation };
};
