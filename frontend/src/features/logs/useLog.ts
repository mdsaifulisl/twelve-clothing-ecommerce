import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getLogs, createLog, clearLogs, resetLogState } from './logSlice';
import type { CreateLogPayload } from './logTypes';

export const useLog = () => {
  const dispatch = useAppDispatch();
  const { logs, isLoading, error, success } = useAppSelector((state) => state.logs);

  const fetchAllLogs = (params?: { search?: string; module?: string }) => {
    dispatch(getLogs(params));
  };

  const addLog = async (logData: CreateLogPayload) => {
    return await dispatch(createLog(logData)).unwrap();
  };

  const removeAllLogs = async () => {
    return await dispatch(clearLogs()).unwrap();
  };

  const resetState = () => {
    dispatch(resetLogState());
  };

  return {
    logs,
    isLoading,
    error,
    success,
    fetchAllLogs,
    addLog,
    removeAllLogs,
    resetState,
  };
};
