import UserApi from "api/UserApi";
import { Variant } from "components/ads/common";
import { Toaster } from "components/ads/Toast";
import { ReduxAction, ReduxActionTypes } from "constants/ReduxActionConstants";
import { APPLICATIONS_URL } from "constants/routes";
import { User } from "constants/userConstants";
import { takeLatest, all, call, put } from "redux-saga/effects";
import history from "utils/history";
import { validateResponse } from "./ErrorSagas";

function* FetchAdminSettingsSaga() {
  const response = yield call(UserApi.fetchSettings);
  const isValidResponse = yield validateResponse(response);

  if (isValidResponse) {
    yield put({
      type: ReduxActionTypes.FETCH_ADMIN_SETTINGS_SUCCESS,
      payload: response.data,
    });
  } else {
    yield put({
      type: ReduxActionTypes.FETCH_ADMIN_SETTINGS_ERROR,
      payload: response,
    });
  }
}

function* FetchAdminSettingsErrorSaga() {
  history.push(APPLICATIONS_URL);
}

function* SaveAdminSettingsSaga(action: ReduxAction<Record<string, string>>) {
  const settings = action.payload;
  yield put({
    type: ReduxActionTypes.FETCH_ADMIN_SETTINGS_SUCCESS,
    payload: settings,
  });
  const response = yield call(UserApi.saveAdminSettings, settings);
  const isValidResponse = yield validateResponse(response);

  if (isValidResponse) {
    Toaster.show({
      text: "Successfully Saved",
      variant: Variant.success,
    });
    yield put({
      type: ReduxActionTypes.SAVE_ADMIN_SETTINGS_SUCCESS,
    });
  } else {
    yield put({
      type: ReduxActionTypes.SAVE_ADMIN_SETTINGS_ERROR,
    });
  }
}

function* InitSuperUserSaga(action: ReduxAction<User>) {
  const user = action.payload;
  if (user.isSuperUser) {
    yield all([
      takeLatest(ReduxActionTypes.FETCH_ADMIN_SETTINGS, FetchAdminSettingsSaga),
      takeLatest(
        ReduxActionTypes.FETCH_ADMIN_SETTINGS_ERROR,
        FetchAdminSettingsErrorSaga,
      ),
      takeLatest(ReduxActionTypes.SAVE_ADMIN_SETTINGS, SaveAdminSettingsSaga),
    ]);
  }
}

export default function* SuperUserSagas() {
  yield takeLatest(
    ReduxActionTypes.FETCH_USER_DETAILS_SUCCESS,
    InitSuperUserSaga,
  );
}
