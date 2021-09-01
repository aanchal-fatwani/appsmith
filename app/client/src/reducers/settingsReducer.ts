import { ReduxAction, ReduxActionTypes } from "constants/ReduxActionConstants";
import { createReducer } from "utils/AppsmithUtils";

const initialState: SettingsReduxState = {
  isLoading: false,
  isSaving: false,
  config: {},
};

export interface SettingsReduxState {
  isLoading: boolean;
  isSaving: boolean;
  config: {
    [key: string]: string;
  };
}

export default createReducer(initialState, {
  [ReduxActionTypes.FETCH_ADMIN_SETTINGS]: (state: SettingsReduxState) => ({
    ...state,
    isLoading: true,
  }),
  [ReduxActionTypes.FETCH_ADMIN_SETTINGS_SUCCESS]: (
    state: SettingsReduxState,
    action: ReduxAction<SettingsReduxState>,
  ) => ({
    isLoading: false,
    config: {
      ...state.config,
      ...action.payload,
    },
  }),
  [ReduxActionTypes.FETCH_ADMIN_SETTINGS_ERROR]: (
    state: SettingsReduxState,
  ) => ({
    ...state,
    isLoading: false,
  }),
  [ReduxActionTypes.SAVE_ADMIN_SETTINGS]: (state: SettingsReduxState) => ({
    ...state,
    isSaving: true,
  }),
  [ReduxActionTypes.SAVE_ADMIN_SETTINGS_ERROR]: (
    state: SettingsReduxState,
  ) => ({
    ...state,
    isSaving: false,
  }),
  [ReduxActionTypes.SAVE_ADMIN_SETTINGS_SUCCESS]: (
    state: SettingsReduxState,
  ) => ({
    ...state,
    isSaving: false,
  }),
});
