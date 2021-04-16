import { createReducer } from "utils/AppsmithUtils";
import { LOG_TYPE, Message, Severity } from "entities/AppsmithConsole";
import { ReduxAction, ReduxActionTypes } from "constants/ReduxActionConstants";
import { get, merge, isEmpty, omit } from "lodash";

const initialState: DebuggerReduxState = {
  logs: [],
  errorCount: 0,
  isOpen: false,
  errors: {},
};

const debuggerReducer = createReducer(initialState, {
  [ReduxActionTypes.DEBUGGER_LOG]: (state: any, action: any) => {
    const isError = action.payload.severity === Severity.ERROR;

    return {
      ...state,
      logs: [...state.logs, action.payload],
      errorCount: isError ? state.errorCount + 1 : state.errorCount,
    };
  },
  [ReduxActionTypes.CLEAR_DEBUGGER_LOGS]: (state: DebuggerReduxState) => {
    return {
      ...state,
      logs: [],
      errorCount: 0,
    };
  },
  [ReduxActionTypes.SHOW_DEBUGGER]: (
    state: DebuggerReduxState,
    action: ReduxAction<boolean>,
  ) => {
    return {
      ...state,
      isOpen: action.payload,
    };
  },
  [ReduxActionTypes.DEBUGGER_ERROR_LOG]: (
    state: DebuggerReduxState,
    action: any,
  ) => {
    const entityId = action.payload.source.id;
    const id =
      action.payload.logType === LOG_TYPE.WIDGET_PROPERTY_VALIDATION_ERROR
        ? `${entityId}-${action.payload.source.propertyPath}`
        : entityId;
    const previousState = get(state.errors, id, {});

    return {
      ...state,
      errors: {
        ...state.errors,
        [id]: {
          ...merge(previousState, action.payload),
        },
      },
    };
  },
  [ReduxActionTypes.DEBUGGER_UPDATE_ERROR_LOG]: (
    state: DebuggerReduxState,
    action: any,
  ) => {
    const entityId = action.payload.source.id;
    const id =
      action.payload.logType === LOG_TYPE.WIDGET_PROPERTY_VALIDATION_ERROR
        ? `${entityId}-${action.payload.source.propertyPath}`
        : entityId;

    if (isEmpty(action.payload.state)) {
      return {
        ...state,
        errors: omit(state.errors, id),
      };
    }

    return {
      ...state,
      errors: {
        ...state.errors,
        [entityId]: {
          ...action.payload,
        },
      },
    };
  },
});

export interface DebuggerReduxState {
  logs: Message[];
  errorCount: number;
  isOpen: boolean;
  errors: Record<string, Message>;
}

export default debuggerReducer;
