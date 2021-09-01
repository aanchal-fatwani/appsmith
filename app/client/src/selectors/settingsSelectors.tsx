import { AppState } from "reducers";

export const getSettings = (state: AppState) => state.settings.config;

export const getSettingsLoadingState = (state: AppState) =>
  state.settings.isLoading;

export const getSettingsSavingState = (state: AppState) =>
  state.settings.isSaving;
