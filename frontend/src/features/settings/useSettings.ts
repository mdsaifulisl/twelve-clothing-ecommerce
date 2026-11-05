import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadManagedSettings, saveBrandingSettings, saveSettingsSection, sendTelegramTestAlert } from './settingsSlice';
import type { SettingsSection } from './settingsType';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.settings);
  const load = useCallback(() => dispatch(loadManagedSettings()), [dispatch]);
  const save = useCallback(async (section: SettingsSection, data: unknown) =>
    await dispatch(saveSettingsSection({ section, data })).unwrap(), [dispatch]);
  const saveBranding = useCallback(async (logo?: File, favicon?: File) =>
    await dispatch(saveBrandingSettings({ logo, favicon })).unwrap(), [dispatch]);
  const testTelegramAlert = useCallback(async () =>
    await dispatch(sendTelegramTestAlert()).unwrap(), [dispatch]);
  return { ...state, load, save, saveBranding, testTelegramAlert };
};
