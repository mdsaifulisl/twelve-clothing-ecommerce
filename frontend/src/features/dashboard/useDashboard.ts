import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadDashboardSummary } from './dashboardSlice';
import type { DashboardPeriod } from './dashboardType';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.dashboard);
  const loadSummary = useCallback((period: DashboardPeriod) => dispatch(loadDashboardSummary(period)), [dispatch]);
  return { ...state, loadSummary };
};
