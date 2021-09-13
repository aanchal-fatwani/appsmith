import { AppState } from "reducers";

export const getSettings = (state: AppState) => state.settings.config;

export const getSettingsLoadingState = (state: AppState) =>
  state.settings.isLoading;

export const getSettingsSavingState = (state: AppState) =>
  state.settings.isSaving;

export const getCurrentVersion = (state: AppState) => {
  if (state.ui.releases.releaseItems.length > 0) {
    return state.ui.releases.releaseItems[0];
  }
};
