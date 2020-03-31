import {
  ActionData,
  ActionDataState,
} from "reducers/entityReducers/actionsReducer";
import { WidgetProps } from "widgets/BaseWidget";
import { ActionResponse } from "api/ActionAPI";
import { CanvasWidgetsReduxState } from "reducers/entityReducers/canvasWidgetsReducer";
import { MetaState } from "reducers/entityReducers/metaReducer";

export type ActionDescription<T> = {
  type: string;
  payload: T;
};

type ActionDispatcher<T, A extends string[]> = (
  ...args: A
) => ActionDescription<T>;

export enum ENTITY_TYPE {
  ACTION = "ACTION",
  WIDGET = "WIDGET",
}

export type RunActionPayload = {
  actionId: string;
  onSuccess: string;
  onError: string;
};

export interface DataTreeAction extends Omit<ActionData, "data"> {
  data: ActionResponse["body"];
  run: ActionDispatcher<RunActionPayload, [string, string]>;
  ENTITY_TYPE: ENTITY_TYPE.ACTION;
}

export interface DataTreeWidget extends WidgetProps {
  ENTITY_TYPE: ENTITY_TYPE.WIDGET;
}

export type DataTreeEntity =
  | DataTreeAction
  | DataTreeWidget
  | ActionDispatcher<any, any>;

export type DataTree = {
  [entityName: string]: DataTreeEntity;
} & { actionPaths?: string[] };

type DataTreeSeed = {
  actions: ActionDataState;
  widgets: CanvasWidgetsReduxState;
  widgetsMeta: MetaState;
};

export class DataTreeFactory {
  static create({ actions, widgets, widgetsMeta }: DataTreeSeed): DataTree {
    const dataTree: DataTree = {};
    dataTree.actionPaths = [
      "navigateTo",
      "navigateToUrl",
      "showAlert",
      "showModal",
      "closeModal",
    ];
    actions.forEach(a => {
      dataTree[a.config.name] = {
        ...a,
        data: a.data ? a.data.body : {},
        run: function(onSuccess: string, onError: string) {
          return {
            type: "RUN_ACTION",
            payload: {
              actionId: this.config.id,
              onSuccess: onSuccess ? `{{${onSuccess.toString()}}}` : "",
              onError: onError ? `{{${onError.toString()}}}` : "",
            },
          };
        },
        ENTITY_TYPE: ENTITY_TYPE.ACTION,
      };
      dataTree.actionPaths && dataTree.actionPaths.push(`${a.config.name}.run`);
    });
    Object.keys(widgets).forEach(w => {
      const widget = widgets[w];
      const widgetMetaProps = widgetsMeta[w];
      dataTree[widget.widgetName] = {
        ...widget,
        ...widgetMetaProps,
        ENTITY_TYPE: ENTITY_TYPE.WIDGET,
      };
    });
    dataTree.navigateTo = function(pageName: string) {
      return {
        type: "NAVIGATE_TO",
        payload: { pageName },
      };
    };

    dataTree.navigateToUrl = function(url: string) {
      return {
        type: "NAVIGATE_TO_URL",
        payload: { url },
      };
    };

    dataTree.showAlert = function(message: string, style: string) {
      return {
        type: "SHOW_ALERT",
        payload: { message, style },
      };
    };

    dataTree.showModal = function(modalName: string) {
      return {
        type: "SHOW_MODAL_BY_NAME",
        payload: { modalName },
      };
    };
    dataTree.closeModal = function(modalName: string) {
      return {
        type: "CLOSE_MODAL",
        payload: { modalName },
      };
    };

    return dataTree;
  }
}
