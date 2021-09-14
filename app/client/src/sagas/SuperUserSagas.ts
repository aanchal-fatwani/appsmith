import UserApi from "api/UserApi";
import { Variant } from "components/ads/common";
import { Toaster } from "components/ads/Toast";
import { ReduxAction, ReduxActionTypes } from "constants/ReduxActionConstants";
import { APPLICATIONS_URL } from "constants/routes";
import { GET_RELEASE_NOTES_URL } from "constants/ThirdPartyConstants";
import { User } from "constants/userConstants";
import { debug } from "loglevel";
import { takeLatest, all, call, put, select } from "redux-saga/effects";
import { getCurrentVersion } from "selectors/settingsSelectors";
import history from "utils/history";
import { validateResponse } from "./ErrorSagas";

function* FetchAdminSettingsSaga() {
  const response = yield call(UserApi.fetchSettings);
  const isValidResponse = yield validateResponse(response);

  if (isValidResponse) {
    const currentVersion = yield select(getCurrentVersion);
    let currentVersionTagName;
    if (currentVersion) {
      currentVersionTagName = currentVersion.tagName;
    }
    const settings = {
      ...response.data,
      APPSMITH_CURRENT_VERSION: currentVersionTagName,
    };
    yield put({
      type: ReduxActionTypes.FETCH_ADMIN_SETTINGS_SUCCESS,
      payload: settings,
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

function* DownloadDockerComposeFile() {
  debug;
}

function* RedirectToReleaseNotes() {
  const currentVersion = yield select(getCurrentVersion);
  if (currentVersion) {
    window
      .open(GET_RELEASE_NOTES_URL(currentVersion.tagName), "_blank")
      ?.focus();
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
      takeLatest(
        ReduxActionTypes.DOWNLOAD_DOCKER_COMPOSE_FILE,
        DownloadDockerComposeFile,
      ),
      takeLatest(
        ReduxActionTypes.REDIRECT_TO_RELEASE_NOTES,
        RedirectToReleaseNotes,
      ),
    ]);
  }
}

export default function* SuperUserSagas() {
  yield takeLatest(
    ReduxActionTypes.FETCH_USER_DETAILS_SUCCESS,
    InitSuperUserSaga,
  );
}
