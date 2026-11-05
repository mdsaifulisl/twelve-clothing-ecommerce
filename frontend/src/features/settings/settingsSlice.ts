import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchManagedSettings, fetchPublicSettings, getSettingsErrorMessage, sendTelegramTestAlert as sendTelegramTestAlertRequest, updateSettingsSection, uploadSettingsBranding } from './settingsApi';
import type { ManagedSettings, PublicStoreSettings, SettingsSection, SettingsState } from './settingsType';

const initialState: SettingsState = { data: null, publicData: null, isLoading: false, isPublicLoading: false, isSaving: false, isTestingTelegram: false, error: null, saved: false };

export const loadPublicSettings = createAsyncThunk<PublicStoreSettings, void, { rejectValue: string }>(
  'settings/loadPublic', async (_, api) => {
    try { return await fetchPublicSettings(api.signal); }
    catch (error) {
      if (api.signal.aborted) throw error;
      return api.rejectWithValue(getSettingsErrorMessage(error, 'Could not load store settings.'));
    }
  },
);

export const loadManagedSettings = createAsyncThunk<ManagedSettings, void, { rejectValue: string }>(
  'settings/load', async (_, api) => {
    try { return await fetchManagedSettings(api.signal); }
    catch (error) {
      if (api.signal.aborted) throw error;
      return api.rejectWithValue(getSettingsErrorMessage(error, 'Could not load settings.'));
    }
  },
);

export const saveSettingsSection = createAsyncThunk<unknown, { section: SettingsSection; data: unknown }, { rejectValue: string }>(
  'settings/saveSection', async ({ section, data }, api) => {
    try { return await updateSettingsSection(section, data); }
    catch (error) { return api.rejectWithValue(getSettingsErrorMessage(error, 'Could not save settings.')); }
  },
);

export const saveBrandingSettings = createAsyncThunk<ManagedSettings['branding'], { logo?: File; favicon?: File }, { rejectValue: string }>(
  'settings/saveBranding', async ({ logo, favicon }, api) => {
    try { return await uploadSettingsBranding(logo, favicon); }
    catch (error) { return api.rejectWithValue(getSettingsErrorMessage(error, 'Could not save branding.')); }
  },
);

export const sendTelegramTestAlert = createAsyncThunk<string, void, { rejectValue: string }>(
  'settings/testTelegram', async (_, api) => {
    try { return await sendTelegramTestAlertRequest(); }
    catch (error) { return api.rejectWithValue(getSettingsErrorMessage(error, 'Could not send a Telegram test alert.')); }
  },
);

export const settingsSlice = createSlice({
  name: 'settings', initialState, reducers: { clearSettingsNotice: (state) => { state.error = null; state.saved = false; } },
  extraReducers: (builder) => {
    builder
      .addCase(loadPublicSettings.pending, (state) => { state.isPublicLoading = true; })
      .addCase(loadPublicSettings.fulfilled, (state, action) => { state.isPublicLoading = false; state.publicData = action.payload; })
      .addCase(loadPublicSettings.rejected, (state) => { state.isPublicLoading = false; })
      .addCase(loadManagedSettings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loadManagedSettings.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(loadManagedSettings.rejected, (state, action) => { state.isLoading = false; if (!action.meta.aborted) state.error = action.payload ?? 'Could not load settings.'; })
      .addCase(saveSettingsSection.pending, (state) => { state.isSaving = true; state.error = null; state.saved = false; })
      .addCase(saveSettingsSection.fulfilled, (state, action) => {
        state.isSaving = false;
        state.saved = true;
        if (state.data) {
          const section = action.meta.arg.section;
          if (section === 'general') state.data.general = action.payload as ManagedSettings['general'];
          if (section === 'seo') state.data.seo = action.payload as ManagedSettings['seo'];
          if (section === 'telegram') state.data.telegram = action.payload as ManagedSettings['telegram'];
          if (section === 'delivery') state.data.delivery = action.payload as ManagedSettings['delivery'];
          if (section === 'payment') state.data.payment = action.payload as ManagedSettings['payment'];
        }
      })
      .addCase(saveSettingsSection.rejected, (state, action) => { state.isSaving = false; state.error = action.payload ?? 'Could not save settings.'; })
      .addCase(saveBrandingSettings.pending, (state) => { state.isSaving = true; state.error = null; state.saved = false; })
      .addCase(saveBrandingSettings.fulfilled, (state, action) => { state.isSaving = false; state.saved = true; if (state.data) state.data.branding = action.payload; })
      .addCase(saveBrandingSettings.rejected, (state, action) => { state.isSaving = false; state.error = action.payload ?? 'Could not save branding.'; })
      .addCase(sendTelegramTestAlert.pending, (state) => { state.isTestingTelegram = true; state.error = null; })
      .addCase(sendTelegramTestAlert.fulfilled, (state) => { state.isTestingTelegram = false; })
      .addCase(sendTelegramTestAlert.rejected, (state, action) => { state.isTestingTelegram = false; state.error = action.payload ?? 'Could not send a Telegram test alert.'; });
  },
});

export const { clearSettingsNotice } = settingsSlice.actions;
export default settingsSlice.reducer;
